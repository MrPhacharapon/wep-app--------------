const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cpwefjcpqykpxdumgogo.supabase.co';
const supabaseKey = 'sb_publishable_NVQ11PVCMKQdaiJFNuLm2g_YIqQhRj_';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDb() {
  const { data: marData, error } = await supabase
    .from('slips')
    .select('bank_account, name, created_at')
    .eq('month', 'มีนาคม')
    .eq('year', '2569');
    
  console.log(`Total slips for Mar 2569: ${marData?.length || 0}`);
  if (error) console.error(error);
  
  if (marData?.length > 0) {
     console.log("All insertions for Mar:");
     console.log(marData.map(d => `${d.bank_account} - ${d.name}`));
  }
}

checkDb();
