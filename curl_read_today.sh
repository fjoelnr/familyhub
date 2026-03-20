# Baikal CalDAV Read Today (Ground Truth)
# Method: REPORT (Standard CalDAV)
# Auth: Digest
# URL Pattern: /dav.php/calendars/{user}/{calendar}/

# 1. Define XML Query (Time-Range Filter)
# Note: Adjust 'start' and 'end' as needed.
cat <<EOF > query.xml
<c:calendar-query xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">
    <d:prop>
        <d:getetag />
        <c:calendar-data />
    </d:prop>
    <c:filter>
        <c:comp-filter name="VCALENDAR">
            <c:comp-filter name="VEVENT">
                <c:time-range start="$(date -u +%Y%m%dT000000Z)" end="$(date -u +%Y%m%dT235959Z)"/>
            </c:comp-filter>
        </c:comp-filter>
    </c:filter>
</c:calendar-query>
EOF

# 2. Execute REPORT
# -u user:password (Digest)
# -H "Content-Type: application/xml; charset=utf-8"
# -H "Depth: 1"
# --data-binary @query.xml
curl -i --digest -u fjoelnir:{{PASSWORD}} \
     -X REPORT \
     -H "Content-Type: application/xml; charset=utf-8" \
     -H "Depth: 1" \
     --data-binary @query.xml \
     "http://192.168.178.99/dav.php/calendars/fjoelnir/valur/"
