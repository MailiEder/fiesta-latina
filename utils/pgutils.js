const pool = require("./get-client");

function readAllResults() {

    return new Promise((resolve, reject) => {
    const query ='SELECT row_number() over (partition by x.ak order by sum(x.zeit)) as rn, laeuferid, name, vorname, verein, ak, MAX(CASE WHEN seqnum = 1 THEN x.zeit END) as orderdate_1, MAX(CASE WHEN seqnum = 2 THEN x.zeit END) as orderdate_2, to_char(SUM(CASE WHEN seqnum < 3 THEN x.zeit END),\'HH:MI:SS\') as gesamtzeit, MAX(CASE WHEN seqwett = 1 THEN x.zeit END) as wettbewerbdate_1, MAX(CASE WHEN seqwett = 2 THEN x.zeit END) as wettbewerbdate_2 FROM (SELECT l.laeuferid, l.name, l.vorname, l.verein, l.ak, z.zeit, ROW_NUMBER() OVER (PARTITION BY l.laeuferid ORDER BY z.zeit) as seqnum, ROW_NUMBER() OVER (PARTITION BY l.laeuferid ORDER BY z.wettbewerbid) as seqwett from laeufer l JOIN zeiten z ON z.laeuferid = l.laeuferid where ascii(left(l.ak,1))=87) x GROUP BY laeuferid, name, vorname, verein, ak Having count(x.zeit) > 1 ORDER BY ak, sum(x.zeit)'
 
    pool.query(query,  (error, results) => {
       if (error) {
       reject(error);
 
       } else {
       resolve(results.rows);
       }	
     });
     });
     
   }

   // Männer
   function readAllMenResults() {

         return new Promise((resolve, reject) => {
         const query ='SELECT row_number() over (partition by x.ak order by sum(x.zeit)) as rn, laeuferid, name, vorname, verein, ak, MAX(CASE WHEN seqnum = 1 THEN x.zeit END) as orderdate_1, MAX(CASE WHEN seqnum = 2 THEN x.zeit END) as orderdate_2, to_char(SUM(CASE WHEN seqnum < 3 THEN x.zeit END),\'HH:MI:SS\') as gesamtzeit, MAX(CASE WHEN seqwett = 1 THEN x.zeit END) as wettbewerbdate_1, MAX(CASE WHEN seqwett = 2 THEN x.zeit END) as wettbewerbdate_2 FROM (SELECT l.laeuferid, l.name, l.vorname, l.verein, l.ak, z.zeit, ROW_NUMBER() OVER (PARTITION BY l.laeuferid ORDER BY z.zeit) as seqnum, ROW_NUMBER() OVER (PARTITION BY l.laeuferid ORDER BY z.wettbewerbid) as seqwett from laeufer l JOIN zeiten z ON z.laeuferid = l.laeuferid where ascii(left(l.ak,1))=77) x GROUP BY laeuferid, name, vorname, verein, ak Having count(x.zeit) > 1 ORDER BY ak, sum(x.zeit)'

         pool.query(query,  (error, results) => {
            if (error) {
            reject(error);
      
            } else {
            resolve(results.rows);
       
            }	
          });
          });
          
        }


   function readAllTeamResults() {
     
  
    return new Promise((resolve, reject) => {
    
    let query ='SELECT ROW_NUMBER() OVER(partition by count(t.teamzeit) ORDER BY sum(teamzeit) ASC) AS Row, teamname, ' +
                 'to_char(MAX(CASE WHEN sseqnum = 1 THEN t.teamzeit END),\'HH:MI:SS\') as OrderDate_1, ' +
                 'to_char(MAX(CASE WHEN sseqnum = 2 THEN t.teamzeit END),\'HH:MI:SS\') as OrderDate_2, to_char(SUM(CASE WHEN sseqnum < 3 THEN t.teamzeit END),\'HH:MI:SS\') as gesamtzeit, ' +
                 'to_char(MAX(CASE WHEN sseqwett = 1 THEN t.teamzeit END),\'HH:MI:SS\') as WettbewerbDate_1, ' +
                 'to_char(MAX(CASE WHEN sseqwett = 2 THEN t.teamzeit END),\'HH:MI:SS\') as WettbewerbDate_2 ' +
                 'FROM (SELECT s.teamname, s.teamzeit, s.wettbewerbid as sseqwett, ROW_NUMBER() OVER (PARTITION BY s.teamname ORDER BY s.teamzeit) as sseqnum ' 
                 
        query = query + 'FROM (SELECT CONCAT(verein, chr(32), chr(49)) as teamname, SUM(CASE WHEN seqnum < 4 THEN x.zeit ELSE \'00:00:00\' ' +  
               'END) as teamzeit, array_agg(seqnum), array_agg(x.zeit), count(case when seqnum < 4 then 1 else null end) as zaehler, wettbewerbid ' +
               'FROM (SELECT l.*, z.*, ROW_NUMBER() OVER (PARTITION BY l.verein ORDER BY z.zeit) as seqnum FROM laeufer l ' +
               'JOIN zeiten z ON z.laeuferid = l.laeuferid where z.wettbewerbid=1 and ascii(left(l.ak,1))=77) x GROUP BY wettbewerbid, verein having count(case when seqnum < 4 then 1 else 0 end) > 2 ' 
   
        query = query + 'UNION ALL SELECT CONCAT(verein, chr(32), chr(50)) as teamname, SUM(CASE WHEN seqnum >3 and seqnum <7 THEN y.zeit ELSE \'00:00:00\' ' + 
               'END) as teamzeit, array_agg(seqnum), array_agg(y.zeit), count(case when seqnum > 3 and seqnum <7 then 1 else null end) as zaehler, wettbewerbid ' +
               'FROM (SELECT l.*, z.*, ROW_NUMBER() OVER (PARTITION BY l.verein ORDER BY z.zeit) as seqnum FROM laeufer l ' +
               'JOIN zeiten z ON z.laeuferid = l.laeuferid where z.wettbewerbid=1 and ascii(left(l.ak,1))=77) y GROUP BY wettbewerbid, verein having count(case when seqnum > 3 and seqnum <7 then 1 else null end) > 2 '
    
        query = query + 'UNION ALL SELECT CONCAT(verein, chr(32), chr(51)) as teamname, SUM(CASE WHEN seqnum >6 and seqnum <10 THEN a.zeit ELSE \'00:00:00\' ' + 
               'END) as teamzeit, array_agg(seqnum), array_agg(a.zeit), count(case when seqnum > 6 and seqnum <10 then 1 else null end) as zaehler, wettbewerbid ' +
               'FROM (SELECT l.*, z.*, ROW_NUMBER() OVER (PARTITION BY l.verein ORDER BY z.zeit) as seqnum FROM laeufer l ' +
               'JOIN zeiten z ON z.laeuferid = l.laeuferid where z.wettbewerbid=1 and ascii(left(l.ak,1))=77) a GROUP BY wettbewerbid, verein having count(case when seqnum > 6 and seqnum <10 then 1 else null end) > 2 '
    
        query = query + 'UNION ALL SELECT CONCAT(verein, chr(32), chr(52)) as teamname, SUM(CASE WHEN seqnum >9 and seqnum <13 THEN b.zeit ELSE \'00:00:00\' ' + 
               'END) as teamzeit, array_agg(seqnum), array_agg(b.zeit), count(case when seqnum > 9 and seqnum <13 then 1 else null end) as zaehler, wettbewerbid ' +
               'FROM (SELECT l.*, z.*, ROW_NUMBER() OVER (PARTITION BY l.verein ORDER BY z.zeit) as seqnum FROM laeufer l ' +
               'JOIN zeiten z ON z.laeuferid = l.laeuferid where z.wettbewerbid=1 and ascii(left(l.ak,1))=77) b GROUP BY wettbewerbid, verein having count(case when seqnum > 9 and seqnum <13 then 1 else null end) > 2 '

        query = query + 'UNION ALL SELECT CONCAT(verein, chr(32), chr(53)) as teamname, SUM(CASE WHEN seqnum >12 and seqnum <16 THEN c.zeit ELSE \'00:00:00\' ' + 
               'END) as teamzeit, array_agg(seqnum), array_agg(c.zeit), count(case when seqnum > 12 and seqnum <16 then 1 else null end) as zaehler, wettbewerbid ' +
               'FROM (SELECT l.*, z.*, ROW_NUMBER() OVER (PARTITION BY l.verein ORDER BY z.zeit) as seqnum FROM laeufer l ' +
               'JOIN zeiten z ON z.laeuferid = l.laeuferid where z.wettbewerbid=1 and ascii(left(l.ak,1))=77) c GROUP BY wettbewerbid, verein having count(case when seqnum > 12 and seqnum <16 then 1 else null end) > 2 '

        query = query + 'UNION ALL SELECT CONCAT(verein, chr(32), chr(49)) as teamname, SUM(CASE WHEN seqnum < 4 THEN x.zeit ELSE \'00:00:00\' ' +
               'END) as teamzeit, array_agg(seqnum), array_agg(x.zeit), count(case when seqnum < 4 then 1 else null end) as zaehler, wettbewerbid ' +
               'FROM( SELECT l.*, z.*, ROW_NUMBER() OVER (PARTITION BY l.verein ORDER BY z.zeit) as seqnum FROM laeufer l ' +
               'JOIN zeiten z ON z.laeuferid = l.laeuferid where z.wettbewerbid=2 and ascii(left(l.ak,1))=77) x GROUP BY wettbewerbid, verein having count(case when seqnum < 4 then 1 else 0 end) > 2 '
    
        query = query + 'UNION ALL SELECT CONCAT(verein, chr(32), chr(50)) as teamname, SUM(CASE WHEN seqnum >3 and seqnum <7 THEN y.zeit ELSE \'00:00:00\' ' + 
               'END) as teamzeit, array_agg(seqnum), array_agg(y.zeit), count(case when seqnum > 3 and seqnum <7 then 1 else null end) as zaehler, wettbewerbid ' +
               'FROM( SELECT l.*, z.*, ROW_NUMBER() OVER (PARTITION BY l.verein ORDER BY z.zeit) as seqnum FROM laeufer l ' +
               'JOIN zeiten z ON z.laeuferid = l.laeuferid where z.wettbewerbid=2 and ascii(left(l.ak,1))=77) y GROUP BY wettbewerbid, verein having count(case when seqnum > 3 and seqnum <7 then 1 else null end) > 2 '
    
        query = query + 'UNION ALL SELECT CONCAT(verein, chr(32), chr(51)) as teamname, SUM(CASE WHEN seqnum >6 and seqnum <10 THEN a.zeit ELSE \'00:00:00\' ' +
               'END) as teamzeit, array_agg(seqnum), array_agg(a.zeit), count(case when seqnum > 6 and seqnum <10 then 1 else null end) as zaehler, wettbewerbid ' +
               'FROM( SELECT l.*, z.*, ROW_NUMBER() OVER (PARTITION BY l.verein ORDER BY z.zeit) as seqnum FROM laeufer l ' +
               'JOIN zeiten z ON z.laeuferid = l.laeuferid where z.wettbewerbid=2 and ascii(left(l.ak,1))=77) a GROUP BY wettbewerbid, verein having count(case when seqnum > 6 and seqnum <10 then 1 else null end) > 2 '

        query = query + 'UNION ALL SELECT CONCAT(verein, chr(32), chr(52)) as teamname, SUM(CASE WHEN seqnum >9 and seqnum <13 THEN b.zeit ELSE\'00:00:00\' ' + 
				       'END) as teamzeit, array_agg(seqnum), array_agg(b.zeit), count(case when seqnum > 9 and seqnum <13 then 1 else null end) as zaehler, wettbewerbid ' +
               'FROM( SELECT l.*, z.*, ROW_NUMBER() OVER (PARTITION BY l.verein ORDER BY z.zeit) as seqnum FROM laeufer l ' +
               'JOIN zeiten z ON z.laeuferid = l.laeuferid where z.wettbewerbid=2 and ascii(left(l.ak,1))=77) b GROUP BY wettbewerbid, verein having count(case when seqnum > 9 and seqnum <13 then 1 else null end) > 2 '

        query = query + 'UNION ALL SELECT CONCAT(verein, chr(32), chr(53)) as teamname, SUM(CASE WHEN seqnum >12 and seqnum <16 THEN c.zeit ELSE \'00:00:00\' ' + 
				       'END) as teamzeit, array_agg(seqnum), array_agg(c.zeit), count(case when seqnum > 12 and seqnum <16 then 1 else null end) as zaehler, wettbewerbid ' +
               'FROM( SELECT l.*, z.*, ROW_NUMBER() OVER (PARTITION BY l.verein ORDER BY z.zeit) as seqnum FROM laeufer l ' +
               'JOIN zeiten z ON z.laeuferid = l.laeuferid where z.wettbewerbid=2 and ascii(left(l.ak,1))=77) c GROUP BY wettbewerbid, verein having count(case when seqnum > 12 and seqnum <16 then 1 else null end) > 2 ' 

        query = query + 'order by wettbewerbid, teamzeit) s) t GROUP BY teamname having count(t.teamzeit) >1 ORDER BY count(t.teamzeit) desc, sum(t.teamzeit) asc'
    
    pool.query(query,  (error, results) => {
       if (error) {
       reject(error);

       } else {
       resolve(results.rows);
  
       }	
     });
     });
     
   }

   function readAllTeamWomenResults() {
       
       return new Promise((resolve, reject) => {
       
       
       let query ='SELECT ROW_NUMBER() OVER(partition by count(t.teamzeit) ORDER BY sum(teamzeit) ASC) AS Row, teamname, ' +
                    'to_char(MAX(CASE WHEN sseqnum = 1 THEN t.teamzeit END),\'HH:MI:SS\') as OrderDate_1, ' +
                    'to_char(MAX(CASE WHEN sseqnum = 2 THEN t.teamzeit END),\'HH:MI:SS\') as OrderDate_2, to_char(SUM(CASE WHEN sseqnum < 3 THEN t.teamzeit END),\'HH:MI:SS\') as gesamtzeit, ' +
                    'to_char(MAX(CASE WHEN sseqwett = 1 THEN t.teamzeit END),\'HH:MI:SS\') as WettbewerbDate_1, ' +
                    'to_char(MAX(CASE WHEN sseqwett = 2 THEN t.teamzeit END),\'HH:MI:SS\') as WettbewerbDate_2 ' +
                    'FROM (SELECT s.teamname, s.teamzeit, s.wettbewerbid as sseqwett, ROW_NUMBER() OVER (PARTITION BY s.teamname ORDER BY s.teamzeit) as sseqnum ' 
                    
           query = query + 'FROM (SELECT CONCAT(verein, chr(32), chr(49)) as teamname, SUM(CASE WHEN seqnum < 4 THEN x.zeit ELSE \'00:00:00\' ' +  
                  'END) as teamzeit, array_agg(seqnum), array_agg(x.zeit), count(case when seqnum < 4 then 1 else null end) as zaehler, wettbewerbid ' +
                  'FROM (SELECT l.*, z.*, ROW_NUMBER() OVER (PARTITION BY l.verein ORDER BY z.zeit) as seqnum FROM laeufer l ' +
                  'JOIN zeiten z ON z.laeuferid = l.laeuferid where z.wettbewerbid=1 and ascii(left(l.ak,1))=87) x GROUP BY wettbewerbid, verein having count(case when seqnum < 4 then 1 else 0 end) > 2 ' 
      
           query = query + 'UNION ALL SELECT CONCAT(verein, chr(32), chr(50)) as teamname, SUM(CASE WHEN seqnum >3 and seqnum <7 THEN y.zeit ELSE \'00:00:00\' ' + 
                  'END) as teamzeit, array_agg(seqnum), array_agg(y.zeit), count(case when seqnum > 3 and seqnum <7 then 1 else null end) as zaehler, wettbewerbid ' +
                  'FROM (SELECT l.*, z.*, ROW_NUMBER() OVER (PARTITION BY l.verein ORDER BY z.zeit) as seqnum FROM laeufer l ' +
                  'JOIN zeiten z ON z.laeuferid = l.laeuferid where z.wettbewerbid=1 and ascii(left(l.ak,1))=87) y GROUP BY wettbewerbid, verein having count(case when seqnum > 3 and seqnum <7 then 1 else null end) > 2 '
       
           query = query + 'UNION ALL SELECT CONCAT(verein, chr(32), chr(51)) as teamname, SUM(CASE WHEN seqnum >6 and seqnum <10 THEN a.zeit ELSE \'00:00:00\' ' + 
                  'END) as teamzeit, array_agg(seqnum), array_agg(a.zeit), count(case when seqnum > 6 and seqnum <10 then 1 else null end) as zaehler, wettbewerbid ' +
                  'FROM (SELECT l.*, z.*, ROW_NUMBER() OVER (PARTITION BY l.verein ORDER BY z.zeit) as seqnum FROM laeufer l ' +
                  'JOIN zeiten z ON z.laeuferid = l.laeuferid where z.wettbewerbid=1 and ascii(left(l.ak,1))=87) a GROUP BY wettbewerbid, verein having count(case when seqnum > 6 and seqnum <10 then 1 else null end) > 2 '
       
           query = query + 'UNION ALL SELECT CONCAT(verein, chr(32), chr(52)) as teamname, SUM(CASE WHEN seqnum >9 and seqnum <13 THEN b.zeit ELSE \'00:00:00\' ' + 
                  'END) as teamzeit, array_agg(seqnum), array_agg(b.zeit), count(case when seqnum > 9 and seqnum <13 then 1 else null end) as zaehler, wettbewerbid ' +
                  'FROM (SELECT l.*, z.*, ROW_NUMBER() OVER (PARTITION BY l.verein ORDER BY z.zeit) as seqnum FROM laeufer l ' +
                  'JOIN zeiten z ON z.laeuferid = l.laeuferid where z.wettbewerbid=1 and ascii(left(l.ak,1))=87) b GROUP BY wettbewerbid, verein having count(case when seqnum > 9 and seqnum <13 then 1 else null end) > 2 '
   
           query = query + 'UNION ALL SELECT CONCAT(verein, chr(32), chr(53)) as teamname, SUM(CASE WHEN seqnum >12 and seqnum <16 THEN c.zeit ELSE \'00:00:00\' ' + 
                  'END) as teamzeit, array_agg(seqnum), array_agg(c.zeit), count(case when seqnum > 12 and seqnum <16 then 1 else null end) as zaehler, wettbewerbid ' +
                  'FROM (SELECT l.*, z.*, ROW_NUMBER() OVER (PARTITION BY l.verein ORDER BY z.zeit) as seqnum FROM laeufer l ' +
                  'JOIN zeiten z ON z.laeuferid = l.laeuferid where z.wettbewerbid=1 and ascii(left(l.ak,1))=87) c GROUP BY wettbewerbid, verein having count(case when seqnum > 12 and seqnum <16 then 1 else null end) > 2 '
   
           query = query + 'UNION ALL SELECT CONCAT(verein, chr(32), chr(49)) as teamname, SUM(CASE WHEN seqnum < 4 THEN x.zeit ELSE \'00:00:00\' ' +
                  'END) as teamzeit, array_agg(seqnum), array_agg(x.zeit), count(case when seqnum < 4 then 1 else null end) as zaehler, wettbewerbid ' +
                  'FROM( SELECT l.*, z.*, ROW_NUMBER() OVER (PARTITION BY l.verein ORDER BY z.zeit) as seqnum FROM laeufer l ' +
                  'JOIN zeiten z ON z.laeuferid = l.laeuferid where z.wettbewerbid=2 and ascii(left(l.ak,1))=87) x GROUP BY wettbewerbid, verein having count(case when seqnum < 4 then 1 else 0 end) > 2 '
       
           query = query + 'UNION ALL SELECT CONCAT(verein, chr(32), chr(50)) as teamname, SUM(CASE WHEN seqnum >3 and seqnum <7 THEN y.zeit ELSE \'00:00:00\' ' + 
                  'END) as teamzeit, array_agg(seqnum), array_agg(y.zeit), count(case when seqnum > 3 and seqnum <7 then 1 else null end) as zaehler, wettbewerbid ' +
                  'FROM( SELECT l.*, z.*, ROW_NUMBER() OVER (PARTITION BY l.verein ORDER BY z.zeit) as seqnum FROM laeufer l ' +
                  'JOIN zeiten z ON z.laeuferid = l.laeuferid where z.wettbewerbid=2 and ascii(left(l.ak,1))=87) y GROUP BY wettbewerbid, verein having count(case when seqnum > 3 and seqnum <7 then 1 else null end) > 2 '
       
           query = query + 'UNION ALL SELECT CONCAT(verein, chr(32), chr(51)) as teamname, SUM(CASE WHEN seqnum >6 and seqnum <10 THEN a.zeit ELSE \'00:00:00\' ' +
                  'END) as teamzeit, array_agg(seqnum), array_agg(a.zeit), count(case when seqnum > 6 and seqnum <10 then 1 else null end) as zaehler, wettbewerbid ' +
                  'FROM( SELECT l.*, z.*, ROW_NUMBER() OVER (PARTITION BY l.verein ORDER BY z.zeit) as seqnum FROM laeufer l ' +
                  'JOIN zeiten z ON z.laeuferid = l.laeuferid where z.wettbewerbid=2 and ascii(left(l.ak,1))=87) a GROUP BY wettbewerbid, verein having count(case when seqnum > 6 and seqnum <10 then 1 else null end) > 2 '
   
           query = query + 'UNION ALL SELECT CONCAT(verein, chr(32), chr(52)) as teamname, SUM(CASE WHEN seqnum >9 and seqnum <13 THEN b.zeit ELSE\'00:00:00\' ' + 
                                      'END) as teamzeit, array_agg(seqnum), array_agg(b.zeit), count(case when seqnum > 9 and seqnum <13 then 1 else null end) as zaehler, wettbewerbid ' +
                  'FROM( SELECT l.*, z.*, ROW_NUMBER() OVER (PARTITION BY l.verein ORDER BY z.zeit) as seqnum FROM laeufer l ' +
                  'JOIN zeiten z ON z.laeuferid = l.laeuferid where z.wettbewerbid=2 and ascii(left(l.ak,1))=87) b GROUP BY wettbewerbid, verein having count(case when seqnum > 9 and seqnum <13 then 1 else null end) > 2 '
   
           query = query + 'UNION ALL SELECT CONCAT(verein, chr(32), chr(53)) as teamname, SUM(CASE WHEN seqnum >12 and seqnum <16 THEN c.zeit ELSE \'00:00:00\' ' + 
                                      'END) as teamzeit, array_agg(seqnum), array_agg(c.zeit), count(case when seqnum > 12 and seqnum <16 then 1 else null end) as zaehler, wettbewerbid ' +
                  'FROM( SELECT l.*, z.*, ROW_NUMBER() OVER (PARTITION BY l.verein ORDER BY z.zeit) as seqnum FROM laeufer l ' +
                  'JOIN zeiten z ON z.laeuferid = l.laeuferid where z.wettbewerbid=2 and ascii(left(l.ak,1))=87) c GROUP BY wettbewerbid, verein having count(case when seqnum > 12 and seqnum <16 then 1 else null end) > 2 ' 
   
           query = query + 'order by wettbewerbid, teamzeit) s) t GROUP BY teamname having count(t.teamzeit) >1 ORDER BY count(t.teamzeit) desc, sum(t.teamzeit) asc'
       
       pool.query(query,  (error, results) => {
          if (error) {
          reject(error);
 
          } else {
          resolve(results.rows);
     
          }	
        });
        });
        
      }

   module.exports = {

       
    getAllResults() {
        return readAllResults();  
      },

    getAllMenResults() {
       return readAllMenResults();  
     },

      getAllTeamResults() {
        return readAllTeamResults();  
      },

      getAllTeamWomenResults() {
       return readAllTeamWomenResults();  
     }


};