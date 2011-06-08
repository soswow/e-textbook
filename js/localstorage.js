//Vladislav: set localSrotage objects manually on document load

$(document).ready(function(){

  // localStorage

  localStorage.setItem('uniqueid0-media','<img src="media/lens.svg" class="media_box" width="600" height="300">');
  localStorage.setItem('uniqueid0-title','<strong>Joonis.</strong> Kaks kera keskpunktidega O<sub>1</sub> ja O<sub>2</sub>, mille pinna osad moodustavad läätse pinnad. Lääts on joonisel viirutatud ja selle optiline peatelg on sirge läbi O<sub>1</sub> ja O<sub>2</sub>.');

  localStorage.setItem('uniqueid1-media','<video controls class="media_box" width="400" height="292" poster="media/Optika.1.3.png"><source src="media/Optika.1.3.1.webm" type="video/webm;"><source src="media/Optika.1.3.1.m4v" type="video/mp4;"></video>');
  localStorage.setItem('uniqueid1-title','<strong>Video:</strong> peale kumerlätse läbimist valguskiired koonduvad.');

  localStorage.setItem('uniqueid2-media','<video controls class="media_box" width="400" height="292" poster="media/Optika.1.3.png"><source src="media/Optika.1.3.4.webm" type="video/webm;"><source src="media/Optika.1.3.4.m4v" type="video/mp4;"></video>');
  localStorage.setItem('uniqueid2-title','<strong>Video:</strong> peale nõguslätse läbimist valguskiired hajuvad.');

  localStorage.setItem('uniqueid3-media','<embed class="media_box" src="media/lens_simulation.swf" width="500" height="300" />');
  localStorage.setItem('uniqueid3-title','<strong>Simulatsioon</strong> kus uuritakse kujutise asukoha ja suuruse sõltuvust eseme kaugusest ja läätse fookuskaugusest.');

  localStorage.setItem('uniqueid4-media','<div class="media_box"><p>Kui katses asetati küünal läätsest 20 sentimeetri kaugusele, tekkis küünla terav kujutis 25 sentimeetri kaugusel asuvale ekraanile. Arvuta läätse optiline tugevus ja ligikaudne fookuskaugus sentimeetrites.</p><hr><p>Lätse optiline tugevus:</p><div><math class="mode-mathEq" display="block"><mi>D</mi><mo>=</mo><mo class="math-edit">□</mo><mfrac><mn>1</mn><mi>a</mi></mfrac><mo class="math-edit">□</mo><mfrac><mn>1</mn><mi>k</mi></mfrac><mo>=</mo><mo class="math-edit">□</mo><mfrac><mn>1</mn><mi class="math-edit">□</mi></mfrac><mo class="math-edit">□</mo><mfrac><mn>1</mn><mi class="math-edit">□</mi></mfrac><mo>=</mo><mi class="math-edit">□</mi><mtext> dptr</mtext></math></div><p>Fookuskaugus:</p><div><math class="mode-mathEq" display="block"><mi>f</mi><mo>=</mo><mi class="math-edit">□</mi><mo>=</mo><mi class="math-edit">□</mi><mtext> cm</mtext></math></div></div>');
  localStorage.setItem('uniqueid4-title','<strong>Ülesanne</strong>');

});
