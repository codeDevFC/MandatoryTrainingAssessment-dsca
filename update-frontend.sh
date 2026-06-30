#!/bin/bash
FILE="frontend/src/App.jsx"
1. Update the getModuleStatus function logic
sed -i '' 's/const getModuleStatus = (moduleId) => {/const getModuleStatus = (moduleId) => {
if (user?.role !== "TRAINEE") return "available";
const progress = userProgress.progress || [];
const moduleProgress = progress.find(x => x.moduleId === moduleId);
if (moduleProgress?.status === "passed") return "completed";
const theoryIds = [1,2,3,4,5,6,7,9,10,11,12,13,14,15,16,18,19,20,21,22,23];
const isPractical = moduleId === 8 || moduleId === 17;
if (isPractical) {
const passedTheory = progress.filter(p => theoryIds.includes(p.moduleId) && p.status === "passed");
if (passedTheory.length < 21) return "locked";
let practicalData = {};
try { practicalData = typeof user.practicalModules === "string" ? JSON.parse(user.practicalModules) : (user.practicalModules || {}); } catch (e) { practicalData = {}; }
return practicalData[moduleId]?.completed ? "available" : "practical_locked";
}
if (moduleId === 1) return "available";
let prevId = moduleId - 1;
while (prevId > 0 && (prevId === 8 || prevId === 17)) prevId--;
if (prevId < 1) return "available";
const prevProgress = progress.find(x => x.moduleId === prevId);
return prevProgress?.status === "passed" ? "available" : "locked";
};
const oldGetStatus = (moduleId) => {/g' $FILE
2. Update the JSX to split into two sections
This part requires manual placement of the provided JSX block at the bottom of the module mapping in App.jsx
echo "Frontend logic updated. Now manually wrap your module lists into the two sections provided in the chat."
