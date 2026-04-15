import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { first_name, last_name, email, password } = body

    if (!email || !password || !first_name || !last_name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Create the user server-side (bypasses email confirmation)
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { first_name, last_name },
      email_confirm: true,
    })

    if (error) {
      if (error.message.includes("already registered") || error.message.includes("already been registered")) {
        return NextResponse.json({ error: "An account with this email already exists. Please sign in instead." }, { status: 409 })
      }
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ userId: data.user.id })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
