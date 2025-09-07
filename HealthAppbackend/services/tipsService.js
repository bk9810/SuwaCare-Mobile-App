// services/tipsService.js
function generateTipsForDisease(diseaseName) {
  const tipsMap = {
    diabetes: [
      "Check your blood sugar daily.",
      "Avoid sugary drinks and processed foods.",
      "Walk at least 30 minutes a day.",
      "Always keep a small snack in case of low sugar."
    ],
    hypertension: [
      "Reduce your salt intake.",
      "Monitor your blood pressure regularly.",
      "Practice relaxation or meditation daily.",
      "Limit alcohol and caffeine."
    ],
    asthma: [
      "Always keep your inhaler with you.",
      "Avoid smoking and secondhand smoke.",
      "Track triggers like dust or cold weather.",
      "Warm up before exercising."
    ],
    heart_disease: [
      "Take your medications on time.",
      "Follow a heart-healthy diet with less saturated fat.",
      "Avoid stressful situations when possible.",
      "Exercise moderately after doctor’s advice."
    ]
  };

  return tipsMap[diseaseName.toLowerCase()] || [
    "Follow your doctor’s advice.",
    "Maintain a balanced diet and stay active."
  ];
}

module.exports = { generateTipsForDisease };
