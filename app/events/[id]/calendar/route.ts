import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerComponentClient({ cookies });

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!event) {
    return new NextResponse("Not found", { status: 404 });
  }

  const ics = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DTSTART:${event.start_time.replace(/[-:]/g, "").split(".")[0]}Z
DTEND:${event.end_time.replace(/[-:]/g, "").split(".")[0]}Z
DESCRIPTION:${event.description ?? ""}
END:VEVENT
END:VCALENDAR
`;

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar",
      "Content-Disposition": "attachment; filename=event.ics",
    },
  });
}
