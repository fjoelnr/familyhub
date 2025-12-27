# Baikal CalDAV Write Event (Ground Truth)
# Method: PUT
# Auth: Digest
# URL Pattern: /dav.php/calendars/{user}/{calendar}/{uid}.ics

# 1. Define Payload
# Note: UID should match the filename
# DTSTART/DTEND should be valid ISO8601
cat <<EOF > event.ics
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Antigravity//Exploration//EN
BEGIN:VEVENT
UID:test-event-$(date +%s)
DTSTAMP:$(date -u +%Y%m%dT%H%M%SZ)
DTSTART:$(date -u +%Y%m%dT%H%M%SZ)
DURATION:PT1H
SUMMARY:Exploration Test Event
DESCRIPTION:Created via curl ground truth script
END:VEVENT
END:VCALENDAR
EOF

# 2. Execute PUT
# -u user:password (Digest)
# -H "Content-Type: text/calendar; charset=utf-8"
# --data-binary @event.ics
curl -i --digest -u fjoelnir:{{PASSWORD}} \
     -X PUT \
     -H "Content-Type: text/calendar; charset=utf-8" \
     --data-binary @event.ics \
     "http://192.168.178.99/dav.php/calendars/fjoelnir/valur/test-event-$(date +%s).ics"
