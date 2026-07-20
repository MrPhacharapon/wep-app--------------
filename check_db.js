const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cpwefjcpqykpxdumgogo.supabase.co';
const supabaseKey = 'sb_publishable_NVQ11PVCMKQdaiJFNuLm2g_YIqQhRj_';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDb() {
  const { data, error } = await supabase
    .from('slips')
    .select('month, year, bank_account, name')
    .eq('bank_account', '6777720480');
    
  console.log("Data for 6777720480:", data);
  if (error) console.error(error);
  
  // also check total slips for January 2569
  const { data: janData } = await supabase
    .from('slips')
    .select('bank_account, name')
    .eq('month', 'มกราคม')
    .eq('year', '2569');
    
  console.log(`Total slips for Jan 2569: ${janData?.length || 0}`);
  if (janData?.length > 0) {
     console.log("Last 5 insertions for Jan:");
     console.log(janData.slice(-5));
  }
}

checkDb();
