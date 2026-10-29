const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// The data extracted from the CRM document
const rawData = `
1|Chijioke Prince Ezeigwe|ezeigwec@coht.co.uk|+447436594611|27/09/2026|23|23|0|4h 10m
2|Muniratu Seidu|seidum@coht.co.uk|+447454972046|27/09/2026|23|23|0|8h 33m
3|OBUKOWHO CHRISTIAN YARERE|usero2@coht.co.uk|+447438734288|27/09/2026|24|23|1|4h 16m
4|ODUNIYI MATULUKO|usero@coht.co.uk|+447756503191|27/09/2026|1|1|0|0h 7m
5|Amaechi Clement Nwaigwe|nwaigwea@coht.co.uk|+447424693341|27/09/2026|17|17|0|2h 59m
6|Ochuko Derek Omiragwa|omiragwa02@coht.co.uk|+447453068047|27/09/2026|17|17|0|3h 57m
7|Kingsley Chijioke Uzochukwu|userk@coht.co.uk|+447778783704|27/09/2026|17|17|0|1h 38m
8|SHARAFADEEN YUSUF DAMILARE|damilares@coht.co.uk|+447413267219|27/09/2026|20|17|3|4h 8m
9|Fajuyi Abiodun|userf@coht.co.uk|+447385548876|27/09/2026|2|2|0|0h 7m
10|Ndidi Michael Okwelle|okwellen@coht.co.uk|+447786012962|27/09/2026|17|17|0|3h 7m
11|Oluwamayokun Adarayaki|adarayakio@coht.co.uk|+447440156121|27/09/2026|17|17|0|2h 23m
12|Bolaji Afolayan|afolayanb@coht.co.uk|+447462349736|27/09/2026|17|17|0|2h 0m
13|Sikirullahi BABATUNDE|users@coht.co.uk|+447838842532|27/09/2026|17|17|0|2h 52m
14|Subita Lakhe|lakhes@coht.co.uk|+447775514068|27/09/2026|17|17|0|1h 13m
15|Agboola Kassim|kassima@coht.co.uk|+447831674925|27/09/2026|17|17|0|5h 27m
16|Titilola Agbele|agbelet@coht.co.uk|+447846884139|27/09/2026|17|17|0|2h 29m
17|Edratu Sillah|sillahe@coht.co.uk|+447404551802|27/09/2026|17|17|0|2h 1m
18|Samuel Obukohwo Djala|djalas@coht.co.uk|+447388309242|27/09/2026|17|17|0|2h 28m
19|Afolakemi Kunnuji|kunnujia@coht.co.uk|+447823686202|27/09/2026|17|17|0|2h 8m
20|Henry Anson|ansonh@coht.co.uk|+447747981429|27/09/2026|17|17|0|2h 3m
21|Kelvin Ajagwe|ajagwek@coht.co.uk|+447833948762|27/09/2026|17|17|0|2h 27m
22|Natacha Hodge|usern@coht.co.uk|+447397278219|27/09/2026|17|17|0|1h 58m
23|Kuizanique Hodge|userk1@coht.co.uk|+447405227290|27/09/2026|0|0|0|0h 0m
24|Kang Bah Tahis-Sudrine|userk2@coht.co.uk|+447482541862|27/09/2026|19|17|2|1h 55m
25|Tongwa Ruth|rutht@coht.co.uk|+447482539207|27/09/2026|19|17|2|1h 53m
26|Nancy Victor Emonfomwan|usern1@coht.co.uk|+447466047795|27/09/2026|22|17|5|3h 14m
27|Ayodele Ayoola|ayoolaa@coht.co.uk|+447826962860|27/09/2026|17|17|0|2h 8m
28|Jessica Onaga|onagaj@coht.co.uk|+447443987037|27/09/2026|17|17|0|0h 42m
29|Primrose Masawi|masawip@coht.co.uk|+447745938968|27/09/2026|17|17|0|3h 15m
30|Harriet Onyinye Ukadike|ukadikeh@coht.co.uk|+447344386200|27/09/2026|18|17|1|1h 22m
31|Modupe Dotzel|dotzelm@coht.co.uk|+447404785780|27/09/2026|17|17|0|2h 4m
32|Stella Odafen|users1@coht.co.uk|+447823563909|27/09/2026|18|17|1|1h 55m
33|Fatimat Titilayo Kareem|kareemf@coht.co.uk|+447344391167|27/09/2026|4|4|0|1h 45m
34|Ohenewaa Afari|afario@coht.co.uk|+447770382646|27/09/2026|7|7|0|0h 34m
35|Rita Idahosa uhuangho|uhuanghor@coht.co.uk|+447506678844|27/09/2026|5|5|0|0h 19m
36|Felix Cobbinah|cobbinahf@coht.co.uk|+447907666278|27/09/2026|0|0|0|0h 0m
37|Der Bams|bamsder2011@gmail.com|+447446180817|27/09/2026|0|0|0|0h 0m
38|Vwaire Ikanone|userv@coht.co.uk|+447852957142|27/09/2026|28|23|5|7h 10m
39|Godfrey Chinwuko|chinwukog@coht.co.uk|+447438987119|27/09/2026|23|23|0|3h 20m
40|Amstrong Moh Moh|moha@coht.co.uk|+447828254504|27/09/2026|23|23|0|5h 23m
41|Victor Ezeike|ezeikev@coht.co.uk|+447827186894|27/09/2026|23|23|0|2h 35m
42|BENARDINE CHIOMA OMEH|omehb@coht.co.uk|+447350157414|27/09/2026|23|23|0|3h 7m
43|Uchendu Nwolu|nwoluu@coht.co.uk|+447495657861|27/09/2026|23|23|0|1h 49m
44|Onyebuchi Aja|ajao@coht.co.uk|+447986919006|27/09/2026|23|23|0|3h 20m
45|Olamilekan Olaseeni|olaseenio@coht.co.uk|+447881191775|27/09/2026|19|19|0|2h 2m
46|Linda-Festus Oni Oni|onil@coht.co.uk|+447565494151|27/09/2026|19|19|0|2h 57m
47|Precious Okhuakhua|userp@coht.co.uk|+447979370847|27/09/2026|19|19|0|3h 4m
48|Damilola Umezurike|umezuriked@coht.co.uk|+447831551038|27/09/2026|23|23|0|3h 40m
49|Toyosi Atanda|atandat@coht.co.uk|+447350153412|27/09/2026|23|23|0|2h 43m
50|Oluwakemi Adedeji|adedejio@coht.co.uk|+447440042696|27/09/2026|25|23|2|3h 32m
51|All Questions (Test Account)|questionsa@coht.co.uk|+447907666278|18/07/2026|6|6|0|0h 25m
52|Hamamat Kamarudeen|userh@coht.co.uk|+447344390656|22/07/2026|23|23|0|2h 41m
53|Macanthony Osigwe|userm@coht.co.uk|+447344327666|22/07/2026|23|23|0|2h 1m
54|Ruth Chioruru|userr@coht.co.uk|+447344391007|22/07/2026|23|23|0|4h 50m
55|Ijeoma joy Ezechie|useri@coht.co.uk|+447443823645|09/10/2026|0|0|0|0h 0m
56|Titilayo Ijato|ijatot@coht.co.uk|+447470536032|09/10/2026|23|23|0|2h 51m
57|Stella Nwobu|nwobus@coht.co.uk|+447344333294|11/10/2026|5|5|0|0h 38m
58|ADAM AYONDO|ayondoa@coht.co.uk|+447875974248|13/10/2026|23|23|0|1h 27m
59|Aderinsola Yakub Bello|belloa@coht.co.uk|+447438657600|15/10/2026|28|23|5|3h 37m
60|Joyce Zvaraveryi|zvavaeryij@coht.co.uk|+447587290131|14/10/2026|23|23|0|1h 42m
61|Magdalene Asmah|userm1@coht.co.uk|+447787631546|15/10/2026|34|23|11|3h 26m
62|Roseline Oduagbon Eguasa|Eguasaroseline@yahoo.com|+447867305199|01/10/2026|0|0|0|0h 0m
63|Omoefe Okhionkpamwonyi-wealth|okhionkpamwonyi-wealtho@coht.co.uk|+447879752252|26/10/2026|19|19|0|1h 50m
64|Uhunwa Okhionkpamwonyi|useru@coht.co.uk|+447405321264|25/10/2026|23|23|0|2h 33m
65|Iyare Enodunmwenben|useri1@coht.co.uk|+447344385128|14/10/2026|23|23|0|2h 12m
66|Sandhya Madduri|madduris@coht.co.uk|+447799081146|15/10/2026|23|23|0|3h 27m
67|Simranjeet Kaur|kaurs@coht.co.uk|+447429996963|15/10/2026|39|23|16|2h 58m
68|Success omosede Aigbe|aigbes@coht.co.uk|+447878971178|01/10/2026|0|0|0|0h 0m
69|Nosa Idehen|idehenn@coht.co.uk|+447340028081|15/10/2026|25|23|2|2h 46m
70|Bernice Kessewaah|userb1@coht.co.uk|+447810403065|23/10/2026|18|18|0|2h 4m
71|Chukwudi Nwafor|nwaforc@coht.co.uk|+447823930536|23/10/2026|25|23|2|11h 31m
72|Success omosede Aigbe (2nd record)|aigbes1@coht.co.uk|+447878971178|14/10/2026|23|23|0|2h 39m
73|Adeesa Frooq|frooqa@coht.co.uk|+447506026962|29/10/2026|23|23|0|1h 31m
74|Enoch Fordjour|fordjoure@coht.co.uk|+447591926063|29/10/2026|5|5|0|0h 35m
75|Rukayat Opeloyeru|opeloyerur@coht.co.uk|+447344384965|29/10/2026|12|10|2|3h 50m
76|Linda Adu|userl1@coht.co.uk|+447494764611|28/10/2026|5|4|1|1h 7m
77|Nelson Odame|odamen@coht.co.uk|+447385316711|29/10/2026|26|25|1|4h 25m
78|Lucy Ogu|userl@coht.co.uk|+447824077706|29/10/2026|24|23|1|2h 15m
79|Shah Begum|begums@coht.co.uk|+447901791303|29/10/2026|28|23|5|2h 26m
80|Rabeya Akter|akterr@coht.co.uk|+447835599240|29/10/2026|23|23|0|4h 15m
81|Enobong Ekwere|ekweree@coht.co.uk|+447909091882|28/10/2026|24|23|1|2h 37m
82|Adeyemi Ogunse|ogunsea@coht.co.uk|+447823689409|28/10/2026|23|23|0|1h 1m
83|Blessing Odunayo Soladoye|soladoyeb@coht.co.uk|+447376625424|28/10/2026|23|23|0|4h 7m
84|Ahmed Akande|akandea@coht.co.uk|+447881170636|28/10/2026|23|23|0|2h 23m
85|Jaspreet Kaur|kaurj@coht.co.uk|+447825842392|28/10/2026|35|23|12|5h 50m
86|Sandra Oriakhi|oriakhis@coht.co.uk|+447405515695|29/10/2026|23|23|0|5h 49m
87|Adebayo Ajayi|ajayia@coht.co.uk|+447979143524|28/10/2026|23|23|0|3h 53m
88|Shekinah Ajayi|ajayis@coht.co.uk|+447979143536|28/10/2026|23|23|0|3h 0m
89|Beauty Ogbebor|ogbeborb@coht.co.uk|+447440704194|22/10/2026|32|23|9|3h 35m
90|Christy Nwatu|userc@coht.co.uk|+447440780101|25/10/2026|23|23|0|5h 42m
91|Adeniyi Akintola|usera4@coht.co.uk|+447448300384|21/10/2026|23|23|0|2h 1m
92|Mabel Moyaki|moyakim@coht.co.uk|+447344384916|25/10/2026|25|23|2|2h 45m
93|Pat Obakpolor|userp2@coht.co.uk|+447405885005|21/10/2026|22|19|3|1h 25m
94|Onyinyechi Elijah|usero2@coht.co.uk|+447776946090|22/10/2026|4|4|0|0h 12m
95|Chris Ohaezukosi|ohaezukosic@coht.co.uk|+447344403738|21/10/2026|23|23|0|0h 59m
96|Stella Mere|meres@coht.co.uk|+447492731885|21/10/2026|23|23|0|1h 26m
97|Ursula Okpala|useru1@coht.co.uk|+447774806324|29/10/2026|10|10|0|2h 56m
98|Joseph Mensah Zanutey|zanuteyj@coht.co.uk|+447481159985|22/10/2026|10|10|0|3h 51m
99|MORUFU RAJI|rajim@coht.co.uk|+447778683795|21/10/2026|23|23|0|3h 32m
100|AUSTIN TIMOTHY|usera3@coht.co.uk|+447440071835|21/10/2026|24|23|1|3h 22m
101|Ohiole Osaimokhai|usero1@coht.co.uk|+447308578983|21/10/2026|24|23|1|3h 1m
102|Isaac Boansi Sarpong|sarpongi@coht.co.uk|+447423336338|22/10/2026|24|23|1|9h 52m
103|Janegreg Onyinye Ezeh|ezehj@coht.co.uk|+447551119446|23/10/2026|22|22|0|1h 31m
104|Benjamin Oniwinde|oniwindeb@coht.co.uk|+447463793167|27/10/2026|23|23|0|6h 47m
105|Yoyinsolami Adesanya|adesanyay@coht.co.uk|+447915070992|08/10/2026|24|23|1|1h 47m
106|Pascaline Kaji|kajip@coht.co.uk|+447852721096|09/10/2026|24|23|1|10h 0m
107|Jennifer serwah Alexander|userj1@coht.co.uk|+447770315628|10/10/2026|5|5|0|0h 30m
108|Onajefe Jennifer Agarin|agarino@coht.co.uk|+447865808798|07/10/2026|23|23|0|1h 15m
109|CHUKWUNONSO Eneh|enehc1@coht.co.uk|+447344333293|08/10/2026|25|23|2|2h 44m
110|Osazuwa Paul Osawa|osawao@coht.co.uk|+447562839994|08/10/2026|15|15|0|2h 30m
111|Abubakar Aliyu|aliyua@coht.co.uk|+447551119767|07/10/2026|23|23|0|3h 6m
112|Babafemi Osanyinbi|userb@coht.co.uk|+447508550312|08/10/2026|3|3|0|0h 16m
113|Frank Nwaru|nwaruf@coht.co.uk|+447350160654|01/10/2026|0|0|0|0h 0m
114|Mary Ayeni|ayenim@coht.co.uk|+447526791008|08/10/2026|23|23|0|2h 37m
115|Emeka fortune Ikpeazu|usere3@coht.co.uk|+447436845757|07/10/2026|3|3|0|0h 34m
116|Olajumoke Adebola|adebolao@coht.co.uk|+447585076176|01/10/2026|0|0|0|0h 0m
117|Emeka fortune Ikpeazu (2nd record)|usere1@coht.co.uk|+447436845757|01/10/2026|0|0|0|0h 0m
118|Ramandeep Singh|singhr@coht.co.uk|+447405515865|08/10/2026|23|23|0|3h 15m
119|CHUKWUNONSO Eneh (2nd record)|enehc@coht.co.uk|+447344333294|01/10/2026|0|0|0|0h 0m
120|Ugochukwu Obiaeli|obiaeliu@coht.co.uk|+447778668978|01/10/2026|0|0|0|0h 0m
121|Sofiyat Oladejo|oladejos@coht.co.uk|+447344397464|07/10/2026|25|23|2|2h 13m
122|Hatisha Rai|userh@coht.co.uk|+447721308976|08/10/2026|5|5|0|0h 31m
123|Pascaline Lepawa Kaji|userp1@coht.co.uk|+447852721096|01/10/2026|0|0|0|0h 0m
124|Precious Aihebhoria|aihebhoriap@coht.co.uk|+447344386002|01/10/2026|0|0|0|0h 0m
125|Obedient Okafor|usero@coht.co.uk|+447344384969|08/10/2026|23|23|0|1h 18m
126|Vikram Vikram|vikramv@coht.co.uk|+447447078086|07/10/2026|23|23|0|4h 43m
127|Jacob Matumamboh|userj@coht.co.uk|+447851712575|06/10/2026|23|23|0|5h 30m
128|Patricia Anane|ananep@coht.co.uk|+447508398489|01/10/2026|27|23|4|5h 4m
`;

async function importArchive() {
    console.log('Starting archive import...\n');
    const lines = rawData.trim().split('\n');
    let count = 0;

    for (const line of lines) {
        const parts = line.split('|');
        if (parts.length < 9) continue;

        const [num, name, email, phone, dateStr, totalAttempts, passed, failed, timeSpent] = parts;
        
        // Convert DD/MM/YYYY to YYYY-MM-DD
        let isoDate = new Date().toISOString().slice(0,10);
        if (dateStr && dateStr.includes('/')) {
            const [d, m, y] = dateStr.split('/');
            if (d && m && y) isoDate = `${y}-${m}-${d}`;
        }

        const notes = `[ARCHIVE] App attempts: ${totalAttempts}, Passed: ${passed}, Failed: ${failed}, App time: ${timeSpent}. Email: ${email}`;

        try {
            await prisma.$executeRaw`
                INSERT INTO "AttendanceRecord" (
                    id, "attendanceId", "learnerName", "learnerPhone", "courseName", "trainerName", 
                    "sessionDate", "trainerNotes", "updatedAt"
                ) VALUES (
                    gen_random_uuid()::text,
                    'ATT-ARC-' || LPAD(${num}::text, 3, '0'),
                    ${name.trim()}, ${phone.trim()}, 'Mandatory Assessment (Full Course)', 'Archive Import',
                    ${new Date(isoDate)}, ${notes}, NOW()
                )
                ON CONFLICT ("attendanceId") DO NOTHING
            `;
            count++;
            if (count % 20 === 0) console.log(`Processed ${count} records...`);
        } catch (e) {
            console.error(`✗ ${name}:`, e.message);
        }
    }

    console.log(`\nDone. Imported ${count} historical records.`);
    await prisma.$disconnect();
}

importArchive();
