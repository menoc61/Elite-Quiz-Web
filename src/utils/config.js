let config = {
  // Set the Demo Version
  demo: false,

  // you get this type data from google adsense

  // <ins class="adsbygoogle"
  //    style="display:block"
  //    data-ad-client="xxxxxxxxxxxx"
  //    data-ad-slot="xxxxxxxxxxxxxx"
  //    data-ad-format="auto"
  //    data-full-width-responsive="true"></ins>

  // googleAddsense
  data_ad_client: "ca-pub-9667891148162497", //ca-pub-your-ad-client-id
  data_ad_slot:"9154149295", //your-ad-slot-id


  //Language Configurations
  // Get Your Language Codes ---> https://developers.google.com/admin-sdk/directory/v1/languages
  supportedLanguages: ["en", "hi", "ur"],
  defaultLanguage: "en",

  // If your Default Language is not in supportedLanguages then add there first and after that set the defaultLanguage.

  //Quiz Configurations
  deductIncorrectAnswerScore: 1, // This will deduct the points if user will give wrong answer

  // default country selection Configurations
  DefaultCountrySelectedInMobile: "in", //Default Country Selected in Mobile Login Screen


  // 1 vs 1 battle Quiz Configurations
  battlecorrectanswer: 4,
  randomBattleoneToTwoSeconds: 2, // quick answer :- 1 vs 1 battle points 2 added on first 1 & 2 seconds
  randomBattlethreeToFourSeconds: 1, // quick answer :- 1 vs 1 battle points 1 added on first 3 & 4 seconds

};

export default config;
