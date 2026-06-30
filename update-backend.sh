#!/bin/bash
FILE="backend/api/index.js"

# Create the updated backend logic
cat << 'INNER_EOF' > backend_update.js
// ============ UPDATED: GENERATE PRACTICAL CODE (SPECIAL TWO) ============
app.post('/api/admin/generate-practical-code', async (req, res) => {
  try {
    // 1. Erase/Invalidate all previous codes
    await prisma.practicalAccessCode.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    });

    // 2. Generate new 8-character code
    const newCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
    
    const practicalCode = await prisma.practicalAccessCode.create({
      data: {
        code: newCode,
        isActive: true,
        expiresAt: expiresAt,
        generatedBy: req.body.generatedBy || 'admin'
      }
    });

    res.json({
      success: true,
      code: practicalCode.code,
      message: 'New FirstAid+Handling Code generated. Old code invalidated.'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate code' });
  }
});

// ============ UPDATED: VERIFY PRACTICAL CODE ============
app.post('/api/auth/verify-practical-code', async (req, res) => {
  const { userId, practicalCode } = req.body;
  const theoryIds = [1,2,3,4,5,6,7,9,10,11,12,13,14,15,16,18,19,20,21,22,23];

  try {
    // 1. Prerequisite Check: Must pass all 21 theory modules
    const progress = await prisma.moduleProgress.findMany({
      where: { userId, moduleId: { in: theoryIds }, status: 'passed' }
    });

    if (progress.length < 21) {
      return res.status(403).json({ 
        error: 'Access Denied: You must pass all 21 theory modules before the Final Assessment.' 
      });
    }

    // 2. Verify current active code
    const activeCode = await prisma.practicalAccessCode.findFirst({
      where: { code: practicalCode.toUpperCase(), isActive: true }
    });

    if (!activeCode) {
      return res.status(401).json({ error: 'Invalid or expired code.' });
    }

    // 3. Unlock both 8 and 17 for the user
    const user = await prisma.user.findUnique({ where: { id: userId } });
    let practicalModules = JSON.parse(user.practicalModules || '{}');
    
    [8, 17].forEach(id => {
      practicalModules[id] = { completed: true, verifiedAt: new Date() };
    });

    await prisma.user.update({
      where: { id: userId },
      data: { practicalModules: JSON.stringify(practicalModules) }
    });

    res.json({ success: true, message: 'Final Practical Assessment Unlocked!' });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});
INNER_EOF

echo "Backend logic prepared in backend_update.js. Please replace the corresponding endpoints in $FILE."
