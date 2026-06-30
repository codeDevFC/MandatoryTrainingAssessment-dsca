#!/bin/bash
This script updates the getModuleStatus function and the JSX layout
sed -i '' 's/const getModuleStatus = (moduleId) => {/const getModuleStatus = (moduleId) => {
const theoryIds = [1,2,3,4,5,6,7,9,10,11,12,13,14,15,16,18,19,20,21,22,23];
const isPractical = moduleId === 8 || moduleId === 17;
const progress = userProgress.progress || [];
if (isPractical) {
const passedTheory = progress.filter(p => theoryIds.includes(p.moduleId) && p.status === "passed");
if (passedTheory.length < 21) return "locked";
const practicalData = JSON.parse(user?.practicalModules || "{}");
return practicalData[moduleId]?.completed ? "available" : "practical_locked";
}/g' frontend/src/App.jsx
echo "Frontend Logic Updated. Now, wrap your Modules 8 & 17 in the new 'Final Practical Assessment' div in your JSX."
