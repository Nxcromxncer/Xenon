const { db } = require('../config/firebase');

exports.startRoundTimer = async (competitionId, durationMinutes) => {
  const endTime = new Date();
  endTime.setMinutes(endTime.getMinutes() + durationMinutes);
  
  await db.collection('competitions').doc(competitionId).update({
    roundEndTime: endTime
  });
  
  return endTime;
};

exports.checkRoundEnd = async (competitionId) => {
  const competitionDoc = await db.collection('competitions').doc(competitionId).get();
  if (!competitionDoc.exists) return false;
  
  const { roundEndTime } = competitionDoc.data();
  if (!roundEndTime) return false;
  
  return new Date() > roundEndTime.toDate();
};