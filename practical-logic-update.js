// ============ UPDATED: GENERATE PRACTICAL CODE ============
app.post('/api/admin/generate-practical-code', async (req, res) => {
  try {
    await prisma.practicalAccessCode.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    });
    const newCode = Math.floor(10000000 + Math.random() * 90000000).toString();
    const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    const practicalCode = await prisma.practicalAccessCode.create({
      data: {
        code: newCode.toUpperCase(),
        isActive: true,
        expiresAt: expiresAt,
        generatedBy: req.body.generatedBy || 'admin'
      }
    });
    res.json({ success: true, code: practicalCode.code });
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

// ============ UPDATED: VERIFY PRACTICAL CODE ============
app.post('/api/auth/verify-practical-code', async (req, res) => {
  const { userId, practicalCode } = req.body;
  const theoryIds = [1,2,3,4,5,6,7,9,10,11,12,13,14,15,16,18,19,20,21,22,23];
  try {
    const progress = await prisma.moduleProgress.findMany({
      where: { userId, moduleId: { in: theoryIds }, status: 'passed' }
    });
    if (progress.length < 21) {
      return res.status(403).json({ error: 'Complete all 21 theory modules first.' });
    }
    const activeCode = await prisma.practicalAccessCode.findFirst({
      where: { code: practicalCode.toUpperCase(), isActive: true }
    });
    if (!activeCode) return res.status(401).json({ error: 'Invalid code.' });
    
    const practicalData = JSON.parse((await prisma.user.findUnique({ where: { id: userId } })).practicalModules || '{}');
    [8, 17].forEach(id => practicalData[id] = { completed: true });
    await prisma.user.update({ where: { id: userId }, data: { practicalModules: JSON.stringify(practicalData) } });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});
