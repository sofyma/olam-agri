#!/usr/bin/env node

/**
 * Smart Scaling System Update Script
 * 
 * This script follows the rule: KEEP all original sizes as per design,
 * only REMOVE the scaling factor when it would make the size go below 18px.
 * 
 * Usage: node update-scaling-system.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to check if a size would go below 18px when scaled
function wouldGoBelow18px(baseSize, scaleFactor = 0.6) {
  // Extract the size value (e.g., "2.4rem" from "calc(2.4rem * var(--scale-factor))")
  const sizeMatch = baseSize.match(/(\d+\.?\d*)(\w+)/);
  if (!sizeMatch) return false;
  
  const numericValue = parseFloat(sizeMatch[1]);
  const unit = sizeMatch[2];
  
  // Convert to pixels for comparison (assuming 16px base font size)
  let sizeInPx;
  if (unit === 'rem') {
    sizeInPx = numericValue * 16;
  } else if (unit === 'px') {
    sizeInPx = numericValue;
  } else {
    // For other units, assume they're fine
    return false;
  }
  
  // Calculate what the size would be after scaling
  const scaledSizeInPx = sizeInPx * scaleFactor;
  
  // Return true if it would go below 18px
  // Using a more conservative approach - if it's close to 18px, remove scaling
  return scaledSizeInPx < 20;
}

// Function to check if a size would go below 150px when scaled (for width/height)
function wouldGoBelow150px(baseSize, scaleFactor = 0.6) {
  // Extract the size value (e.g., "10.7rem" from "calc(10.7rem * var(--scale-factor))")
  const sizeMatch = baseSize.match(/(\d+\.?\d*)(\w+)/);
  if (!sizeMatch) return false;
  
  const numericValue = parseFloat(sizeMatch[1]);
  const unit = sizeMatch[2];
  
  // Convert to pixels for comparison (assuming 16px base font size)
  let sizeInPx;
  if (unit === 'rem') {
    sizeInPx = numericValue * 16;
  } else if (unit === 'px') {
    sizeInPx = numericValue;
  } else {
    // For other units, assume they're fine
    return false;
  }
  
  // Calculate what the size would be after scaling
  const scaledSizeInPx = sizeInPx * scaleFactor;
  
  // Return true if it would go below 150px
  return scaledSizeInPx < 150;
}

// Function to transform calc() expressions based on the rule
function transformCalcExpression(match, baseSize, propertyName = '') {
  // Check if this is a width/height property that should use the 150px threshold
  const isWidthHeightProperty = /^(width|height|inline-size|block-size|min-width|max-width|min-height|max-height)$/i.test(propertyName);
  
  if (isWidthHeightProperty) {
    // Check if this size would go below 150px when scaled
    if (wouldGoBelow150px(baseSize)) {
      // Remove scaling factor - use original size
      console.log(`  ❌ Below 150px (${propertyName}): ${match} → ${baseSize.trim()}`);
      return baseSize.trim();
    } else {
      // Keep the scaling factor - size is fine
      console.log(`  ✅ Above 150px (${propertyName}): ${match} (keeping scaling)`);
      return match;
    }
  } else {
    // Check if this size would go below 18px when scaled (for font-size and other properties)
    if (wouldGoBelow18px(baseSize)) {
      // Remove scaling factor - use original size
      console.log(`  ❌ Below 18px (${propertyName}): ${match} → ${baseSize.trim()}`);
      return baseSize.trim();
    } else {
      // Keep the scaling factor - size is fine
      console.log(`  ✅ Above 18px (${propertyName}): ${match} (keeping scaling)`);
      return match;
    }
  }
}

// Function to process a file
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Pattern to match calc() expressions with scale factor
    const calcPattern = /calc\(([^)]+)\s*\*\s*var\(--scale-factor\)\)/g;
    
    content = content.replace(calcPattern, (match, baseSize, offset) => {
      // Try to find the property name by looking backwards from the match
      const beforeMatch = content.substring(0, offset);
      const lines = beforeMatch.split('\n');
      const currentLine = lines[lines.length - 1];
      
      // Extract property name from the current line
      const propertyMatch = currentLine.match(/([a-zA-Z-]+)\s*:\s*$/);
      const propertyName = propertyMatch ? propertyMatch[1] : '';
      
      const transformed = transformCalcExpression(match, baseSize.trim(), propertyName);
      if (transformed !== match) {
        modified = true;
      }
      return transformed;
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
    }
    
    return modified;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Function to find all Svelte files recursively
function findSvelteFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverse(fullPath);
      } else if (item.endsWith('.svelte') || item.endsWith('.css') || item.endsWith('.scss')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Main execution
function main() {
  console.log('🔧 Smart Scaling System Update Tool');
  console.log('=====================================');
  console.log('Rule: KEEP all original sizes, only REMOVE scaling when:');
  console.log('- Font-size and other properties: below 18px');
  console.log('- Width/height properties: below 150px');
  console.log('');
  
  const srcDir = path.join(__dirname, 'src');
  const files = findSvelteFiles(srcDir);
  
  console.log(`Found ${files.length} files to process:\n`);
  
  let updatedCount = 0;
  
  for (const file of files) {
    console.log(`Processing: ${path.relative(__dirname, file)}`);
    if (processFile(file)) {
      updatedCount++;
    }
    console.log('');
  }
  
  console.log(`\n🎉 Summary:`);
  console.log(`- Processed ${files.length} files`);
  console.log(`- Updated ${updatedCount} files`);
  console.log(`\n✅ Smart scaling system applied!`);
  console.log(`- All original design sizes preserved`);
  console.log(`- Font-size scaling removed when below 18px`);
  console.log(`- Width/height scaling removed when below 150px`);
  console.log(`- All other sizes keep their scaling factor`);
}

// Run the script
main(); 