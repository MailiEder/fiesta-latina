import  pgutils  from '../../../utils/pgutils';

export async function GET()  {

try {
    const allresults = await pgutils.getAllMenResults();

return new Response(JSON.stringify(allresults)
         ,{status: 200});
} catch (error) {
    return new Response("Fehler beim Lesen der Männerergebnisse!", { status: 500 })
}
   
};