const BRAVEN_SETTINGS_KEY = 'braven_store_settings';
const BRAVEN_DEFAULT_SETTINGS = {
  brandName: 'BRAVEN', brandTagline: 'Wear Your Style',
  heroEyebrow: 'أحدث التصاميم لعام 2026', heroTitle: 'تيشيرتات تعبر عن شخصيتك',
  heroText: 'تصاميم عصرية · جودة عالية · راحة لا تضاهى · أزياء تمزج بين الأسلوب والراحة', heroButtonText: 'تسوق الآن', heroButtonLink: '#products',
  productsTitle: 'أحدث المنتجات', productsSubtitle: 'اختيارات جديدة كل أسبوع', categoriesTitle: 'تسوق حسب الفئة', categoriesSubtitle: 'اختار الستايل اللي يناسبك',
  socialTitle: 'تابعنا على', socialHeadline: 'Instagram · TikTok · WhatsApp', socialText: 'محتوى حصري، تصاميم جديدة وكواليس التصنيع', socialButtonText: 'تابعنا الآن',
  phone: '01001648519', whatsapp: 'https://wa.me/201001648519', instagram: 'https://www.instagram.com/braven7117', tiktok: 'https://www.tiktok.com/@braven9631', email: 'braven.store6@gmail.com',
  footerDescription: 'متجر تيشيرتات عصري يهتم بالتفاصيل والجودة.',
  sections: {categories:true, benefits:true, products:true, social:true},
  categories: [
    {label:'تيشيرتات رجالية',filter:'رجالي'},{label:'تيشيرتات نسائية',filter:'نسائي'},{label:'تيشيرتات أطفال',filter:'أطفال'},
    {label:'تصاميم مميزة',filter:'تصاميم'},{label:'تيشيرتات كاجوال',filter:'كاجوال'},{label:'هوديز',filter:'هوديز'},{label:'إكسسوارات',filter:'إكسسوارات'}
  ]
};
function mergeBravenSettings(value){const data=value&&typeof value==='object'?value:{};return {...BRAVEN_DEFAULT_SETTINGS,...data,sections:{...BRAVEN_DEFAULT_SETTINGS.sections,...(data.sections||{})},categories:Array.isArray(data.categories)&&data.categories.length?data.categories:BRAVEN_DEFAULT_SETTINGS.categories};}
async function loadBravenSettings(client){
  try{const {data,error}=await client.from('store_settings').select('data').eq('id',1).maybeSingle();if(!error&&data?.data){const merged=mergeBravenSettings(data.data);localStorage.setItem(BRAVEN_SETTINGS_KEY,JSON.stringify(merged));return merged;}}catch(error){console.warn('BRAVEN settings fallback:',error?.message||error);}
  try{return mergeBravenSettings(JSON.parse(localStorage.getItem(BRAVEN_SETTINGS_KEY)||'{}'));}catch{return mergeBravenSettings({});}
}
function setText(id,value){const el=document.getElementById(id);if(el)el.textContent=value??'';}
function setHref(id,value){const el=document.getElementById(id);if(el&&value)el.href=value;}
function toggleSection(id,visible){const el=document.getElementById(id);if(el)el.style.display=visible?'':'none';}
function applyBravenSettings(settings){
  const s=mergeBravenSettings(settings);document.title=`${s.brandName} | تيشيرتات تعبر عن شخصيتك`;
  document.querySelectorAll('[data-brand-name]').forEach(el=>el.textContent=s.brandName);document.querySelectorAll('[data-brand-tagline]').forEach(el=>el.textContent=s.brandTagline);
  setText('heroEyebrow',s.heroEyebrow);setText('heroTitle',s.heroTitle);setText('heroText',s.heroText);setText('heroButton',s.heroButtonText);setHref('heroButton',s.heroButtonLink);
  setText('categoriesTitle',s.categoriesTitle);setText('categoriesSubtitle',s.categoriesSubtitle);setText('productsTitle',s.productsTitle);setText('productsSubtitle',s.productsSubtitle);
  setText('socialTitle',s.socialTitle);setText('socialHeadline',s.socialHeadline);setText('socialText',s.socialText);setText('socialButton',s.socialButtonText);setHref('socialButton',s.instagram);
  setText('footerDescription',s.footerDescription);setText('contactPhone',s.phone);setText('contactEmail',s.email);setHref('contactPhone',`tel:${s.phone.replace(/\s+/g,'')}`);setHref('contactWhatsapp',s.whatsapp);setHref('contactInstagram',s.instagram);setHref('contactTiktok',s.tiktok);
  setHref('topPhone',`tel:${s.phone.replace(/\s+/g,'')}`);setHref('topWhatsapp',s.whatsapp);setHref('topInstagram',s.instagram);setHref('topTiktok',s.tiktok);setHref('topEmail',`mailto:${s.email}`);
  setHref('socialInstagram',s.instagram);setHref('socialTiktok',s.tiktok);setHref('socialWhatsapp',s.whatsapp);setHref('socialEmail',`mailto:${s.email}`);
  toggleSection('categoriesSection',s.sections.categories);toggleSection('benefitsSection',s.sections.benefits);toggleSection('productsSection',s.sections.products);toggleSection('socialSection',s.sections.social);
  const categories=document.getElementById('categoryButtons');if(categories){categories.innerHTML=s.categories.map(c=>`<button data-filter="${String(c.filter||'').replace(/"/g,'&quot;')}">${String(c.label||c.filter||'')}</button>`).join('');if(typeof handleCategoryFilter==='function')handleCategoryFilter();}
  return s;
}
