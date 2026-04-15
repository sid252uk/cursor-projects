import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, name, slug, description, phone, email } = body

    if (!userId || !name || !slug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Upsert profile with restaurant_owner role
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({ id: userId, role: "restaurant_owner" }, { onConflict: "id" })

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    // Insert restaurant
    const { data: restaurant, error: restError } = await supabase
      .from("restaurants")
      .insert({
        owner_user_id: userId,
        name,
        slug,
        description: description || null,
        phone: phone || null,
        email: email || null,
      })
      .select("slug")
      .single()

    if (restError) {
      if (restError.code === "23505") {
        return NextResponse.json({ error: "That URL is already taken. Choose a different one." }, { status: 409 })
      }
      return NextResponse.json({ error: restError.message }, { status: 500 })
    }

    return NextResponse.json({ slug: restaurant.slug })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
