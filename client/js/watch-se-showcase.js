/* Apple Watch SE 3 presentation. All photography is supplied in watch_segment/. */
const WatchSEShowcase = (() => {
  const base = 'images/watch_segment/';
  const features = [
    { key: 'activity', eyebrow: 'ACTIVITY RINGS', title: 'Every move<br>adds up.', text: 'A little motivation for your everyday movement. Keep your Activity Rings in view and make progress one day at a time.', file: 'highlights_activity_rings_endframe__fjf3belbpw2u_large_2x.jpg', alt: 'Apple Watch displaying a colorful Activity Rings celebration' },
    { key: 'sleep', eyebrow: 'SLEEP SCORE', title: 'Wake up to<br>a clearer picture.', text: 'Your night, at a glance. See your sleep score on your wrist and get to know your nightly routine.', file: 'highlights_sleep_score__gg1jx7w3zfee_large_2x.jpg', alt: 'Apple Watch displaying a sleep score of 84' },
    { key: 'safety', eyebrow: 'SAFETY', title: 'Support.<br>Close at hand.', text: 'Keep safety features close, with Emergency SOS right on your wrist when you need to reach out for help.', file: 'highlights_safety__ehj70sr1vygm_large_2x.jpg', alt: 'Emergency SOS symbol surrounded by soft red circles' },
    { key: 'siri', eyebrow: 'SIRI', title: 'A little help.<br>Just ask.', text: 'Set a reminder, ask a question, or keep your day moving. Talk to Siri without reaching for your phone.', file: 'highlights_siri_ai__9zfn0d22xxue_large_2x.jpg', alt: 'Apple Watch showing the Siri interface and a personalized watch face' }
  ];
  function intro(product) {
    return '<header class="watch-se-intro"><p class="watch-se-wordmark">' + appleLogoHtml(30) + '<span>WATCH <strong>SE 3</strong></span></p>' +
      '<h1>So much to love.<br><span>So easy to make yours.</span></h1>' +
      '<p class="watch-se-lead">Your everyday companion for movement, connection, and a little more you.</p>' +
      '<p class="watch-se-starting">From ' + formatINR(product.price) + '</p>' +
      '<div class="watch-se-intro-links"><a href="#watchConfigure" class="watch-se-buy">Choose your Watch</a><a href="#watchHighlights">Explore the highlights <span aria-hidden="true">&#8595;</span></a></div>' +
      '<p class="watch-se-image-note">Explore the available case, band, and connectivity options below.</p></header>';
  }
  function sections() {
    return '<section class="watch-se-highlights" id="watchHighlights" aria-labelledby="watchHighlightsTitle"><div class="watch-se-section-heading"><p class="watch-se-eyebrow">MADE FOR YOUR EVERYDAY</p>' +
      '<h2 id="watchHighlightsTitle">Good days.<br>Great possibilities.</h2><p>Little things that make a big part of your day.</p></div>' +
      '<div class="watch-se-feature-grid">' + features.map(feature => '<article class="watch-se-feature watch-se-feature--' + feature.key + '">' +
        '<div class="watch-se-feature-copy"><p class="watch-se-eyebrow">' + feature.eyebrow + '</p><h3>' + feature.title + '</h3><p>' + feature.text + '</p></div>' +
        '<img src="' + base + feature.file + '" alt="' + feature.alt + '" loading="lazy" decoding="async" width="2520" height="1360"></article>').join('') + '</div></section>' +
      '<section class="watch-se-design" aria-labelledby="watchDesignTitle"><div class="watch-se-design-copy"><p class="watch-se-eyebrow">YOUR WATCH. YOUR WAY.</p>' +
      '<h2 id="watchDesignTitle">A look<br>all your own.</h2><p>Find your finish. Pick your fit. Choose from the case finishes and band sizes available for Apple Watch SE 3.</p>' +
      '<a href="#watchConfigure">Find your combination <span aria-hidden="true">&#8594;</span></a></div>' +
      '<img src="' + base + 'product_finishes__dluijwwmh7ue_large_2x.jpg" alt="Close-up of Apple Watch SE 3 with a light aluminium case and purple woven band" loading="lazy" decoding="async" width="3440" height="1824"></section>';
  }
  return { intro, sections };
})();
