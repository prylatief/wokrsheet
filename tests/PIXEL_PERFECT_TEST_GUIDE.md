# Pixel-Perfect Rendering Test Guide

## Overview

This guide provides comprehensive testing procedures for verifying pixel-perfect PDF rendering with 0px tolerance. The tests validate all improvements made in the pdf-rendering-precision spec.

## Test Files

1. **pixel-perfect-rendering.test.js** - Automated test suite (requires browser environment)
2. **pixel-perfect-visual.html** - Interactive visual testing tool
3. **This guide** - Manual testing procedures and verification steps

## Testing Approach

### Automated Tests (Browser Required)

The automated test suite (`pixel-perfect-rendering.test.js`) requires a browser environment with DOM support. To run:

```bash
# Option 1: Open in browser with test runner
# Load the test file in a browser console or use a test runner like Jest with jsdom

# Option 2: Use the visual test page
# Open tests/pixel-perfect-visual.html in a browser
```

### Visual Testing (Recommended)

The visual test page provides interactive testing with measurement tools:

1. Open `tests/pixel-perfect-visual.html` in your browser
2. Use the measurement tools to verify alignment
3. Test in multiple browsers (Chrome, Firefox, Edge)
4. Export results for documentation

## Test Tasks

### Task 7.1: Answer Line Alignment in Counting Exercise

**Requirements:** 1.1, 1.2, 1.3, 1.4

**What to Test:**
- Answer line should be perfectly aligned with emoji/text baseline
- No vertical shift between preview and PDF
- Using inline-flex with explicit 16px height
- Border width: 2px (not pt)
- Transform: translateZ(0) applied

**Manual Verification:**
1. Create a worksheet with counting exercise (e.g., "Count Apples" with 5 apples)
2. Generate PDF
3. Compare preview vs PDF side-by-side
4. Measure vertical position of answer line
5. **Pass Criteria:** 0px difference in vertical alignment

**Visual Test:**
- Open `pixel-perfect-visual.html`
- Check Task 7.1 section
- Click "Measure Alignment"
- Verify display: inline-flex, height: 16px, border: 2px

### Task 7.2: Math Equation Border Alignment

**Requirements:** 2.1, 2.2, 2.3, 2.4

**What to Test:**
- Border-bottom aligns perfectly with number baseline
- No shift up or down in PDF
- Border thickness consistent (3px)
- All inline elements perfectly aligned

**Manual Verification:**
1. Create worksheet with addition (e.g., 3 + 4 = ___)
2. Create worksheet with subtraction (e.g., 8 - 3 = ___)
3. Generate PDF for each
4. Compare border alignment in preview vs PDF
5. **Pass Criteria:** 0px difference in border position

**Visual Test:**
- Check Task 7.2 section in visual test page
- Verify all borders are at same vertical position
- Measure max difference (should be 0px)

### Task 7.3: Header Title Positioning

**Requirements:** 3.1, 3.2, 3.3, 3.4

**What to Test:**
- Title "Latihan Hari Ini" maintains vertical position
- No shift up or down in PDF
- Flexbox baseline alignment working correctly
- Transform optimization applied

**Manual Verification:**
1. Create worksheet with title "Latihan Hari Ini"
2. Generate PDF
3. Measure title vertical position in preview
4. Measure title vertical position in PDF
5. **Pass Criteria:** 0px difference in position

**Visual Test:**
- Check Task 7.3 section
- Verify header uses flex with items-baseline
- All header elements should be baseline-aligned

### Task 7.4: Spelling Box Borders

**Requirements:** 5.1, 5.2, 5.3, 5.4

**What to Test:**
- All spelling box borders perfectly horizontal
- All borders aligned at same vertical position
- No tilt or misalignment
- Using px units for borders

**Manual Verification:**
1. Create spelling exercise (e.g., "BOLA" with 4 boxes)
2. Generate PDF
3. Check that all borders are perfectly straight
4. Measure vertical position of each border
5. **Pass Criteria:** Max 0px difference between borders

**Visual Test:**
- Check Task 7.4 section
- Measure alignment of all 4 boxes
- Verify max difference is < 0.5px

### Task 7.5: Pattern Exercise Alignment

**Requirements:** 1.1, 1.2, 2.1, 2.2

**What to Test:**
- Answer line aligns with emoji items
- Pattern items all on same baseline
- No vertical misalignment in PDF

**Manual Verification:**
1. Create pattern exercise (e.g., 😊😂😊 → ___)
2. Generate PDF
3. Verify answer line aligns with emojis
4. **Pass Criteria:** 0px difference in baseline alignment

**Visual Test:**
- Check Task 7.5 section
- Verify emoji and answer line alignment
- Measure baseline difference

### Task 7.6: Cross-Browser Testing

**Requirements:** 6.1, 6.2, 6.3

**What to Test:**
- PDF generation works in Chrome, Firefox, Edge
- Consistent output across browsers
- No browser-specific rendering issues

**Manual Verification:**
1. Test in Chrome:
   - Create worksheet with all exercise types
   - Generate PDF
   - Document any issues
   
2. Test in Firefox:
   - Same worksheet as Chrome
   - Generate PDF
   - Compare with Chrome output
   
3. Test in Edge:
   - Same worksheet
   - Generate PDF
   - Compare with Chrome and Firefox

4. **Pass Criteria:** 
   - All browsers generate PDFs successfully
   - Visual differences < 1px
   - No browser-specific errors

**Visual Test:**
- Open visual test page in each browser
- Check browser info section
- Run all tests in each browser
- Export and compare results

### Task 7.7: Performance Testing with Scale 3

**Requirements:** 4.3, 7.1

**What to Test:**
- PDF generation time with scale 3
- Memory usage acceptable
- Performance with complex worksheets (10+ exercises)

**Manual Verification:**
1. Create simple worksheet (3 exercises)
   - Measure generation time
   - Note: Should be < 5 seconds
   
2. Create complex worksheet (10 exercises)
   - Measure generation time
   - Note: Should be < 15 seconds
   - Check browser memory usage
   
3. Compare scale 2 vs scale 3:
   - Scale 2: 192 DPI
   - Scale 3: 288 DPI
   - Improvement: 50%
   
4. **Pass Criteria:**
   - Simple worksheet: < 5 seconds
   - Complex worksheet: < 15 seconds
   - Memory usage: < 50MB per page
   - No browser crashes or freezes

**Visual Test:**
- Check Task 7.7 section
- Click "Measure Performance"
- Verify canvas creation time
- Check memory calculations

## Test Results Documentation

### Recording Results

For each test task, document:

1. **Test Environment:**
   - Browser name and version
   - Operating system
   - Screen resolution
   - Device pixel ratio

2. **Test Results:**
   - Pass/Fail status
   - Measurements (in pixels)
   - Screenshots (preview vs PDF)
   - Any issues or anomalies

3. **Performance Metrics:**
   - Generation time
   - Memory usage
   - File size

### Example Test Report

```markdown
## Test Report: Task 7.1 - Answer Line Alignment

**Date:** 2025-11-20
**Tester:** [Name]
**Browser:** Chrome 120.0
**OS:** Windows 11

### Test Case 1: Counting Exercise (5 apples)

**Preview Measurement:**
- Answer line bottom position: 245.50px
- Emoji baseline position: 245.50px
- Difference: 0.00px ✅

**PDF Measurement:**
- Answer line bottom position: 245.50px
- Emoji baseline position: 245.50px
- Difference: 0.00px ✅

**Result:** PASS ✅
**Notes:** Perfect alignment, no sub-pixel shift detected

### Test Case 2: Counting Exercise (10 items)

[Similar format...]

**Overall Result:** PASS ✅
```

## Common Issues and Troubleshooting

### Issue: Sub-pixel Rendering

**Symptoms:** Lines appear slightly shifted (0.5px)
**Solution:** Verify transform: translateZ(0) is applied
**Check:** CSS classes have pdf-optimized applied

### Issue: Font Not Loaded

**Symptoms:** Text appears in fallback font
**Solution:** Wait for fonts to load before PDF generation
**Check:** waitForFonts() function is called

### Issue: Browser Compatibility

**Symptoms:** Different output in different browsers
**Solution:** Test CSS feature support
**Check:** Browser supports inline-flex, transform, backface-visibility

### Issue: Performance Problems

**Symptoms:** Slow PDF generation, browser freeze
**Solution:** Reduce complexity or use scale 2
**Check:** Memory usage, number of exercises per page

## Success Criteria Summary

All tests must meet these criteria:

- ✅ **Alignment Tolerance:** 0px (pixel-perfect)
- ✅ **Border Units:** px (not pt)
- ✅ **Display Mode:** inline-flex (not inline-block)
- ✅ **Transform:** translateZ(0) applied
- ✅ **Height:** Explicit px values (not em)
- ✅ **Cross-Browser:** Works in Chrome, Firefox, Edge
- ✅ **Performance:** < 15 seconds for complex worksheets
- ✅ **Memory:** < 50MB per page

## Automated Test Execution

To run automated tests in a browser environment:

```javascript
// In browser console or test runner
// Load the test file
const script = document.createElement('script');
script.src = 'tests/pixel-perfect-rendering.test.js';
document.head.appendChild(script);

// Or use the visual test page
// Open tests/pixel-perfect-visual.html
// Click "Run All Tests"
```

## Conclusion

These tests verify that all PDF rendering improvements are working correctly and that the output is pixel-perfect with 0px tolerance. All tests should pass before considering the implementation complete.

For questions or issues, refer to:
- Design document: `.kiro/specs/pdf-rendering-precision/design.md`
- Requirements: `.kiro/specs/pdf-rendering-precision/requirements.md`
- Tasks: `.kiro/specs/pdf-rendering-precision/tasks.md`
