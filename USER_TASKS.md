# Verizon CX Workbench - Main User Tasks

## Overview
The Verizon CX Workbench helps Business Analysts define analytics tracking for customer journeys and deliver specifications to developers.

---

## 🎯 5 Core User Tasks

### **TASK 1: Select a Customer Journey to Analyze**

**What users do:**
- Browse the library of 41 customer journeys (e.g., "5G Upgrade", "Add a Line", "Trade-in Device")
- Filter by platform (Mobile/Desktop) or category (Acquisition, Support, etc.)
- Click on a journey to start analyzing

**Outcome:** Journey opens in the Analyze workspace

---

### **TASK 2: Review & Approve AI Tag Recommendations**

**What users do:**

**Option A - Review Individual Tags:**
1. Click on numbered markers on the screen preview
2. Read the AI's suggested tag name and reason
3. Choose one action:
   - **Approve** - Accept the AI recommendation
   - **Edit** - Modify the tag name or details, then approve
   - **Reject** - Decline with a reason (helps AI learn)

**Option B - Bulk Operations:**
1. View all tags in a list
2. Click "Accept All" to approve multiple tags at once
3. Click "Decline All" to reject multiple tags

**Outcome:** Tags are marked as Approved or Rejected. Progress tracker updates (e.g., 8/12 → 12/12)

---

### **TASK 3: Correct AI Decisions (Optional)**

**What users do:**
- Open the AI chat assistant
- Type natural language commands to correct mistakes:
  - "Wrong rule used" - AI asks which rule to use instead
  - "Use Upgrade Eligibility Rule" - AI applies the correct business rule
  - "Re-run analysis" - AI analyzes the journey again with corrections
  - "Show all available rules" - See what rules exist

**Outcome:** AI learns from corrections and updates recommendations in real-time

---

### **TASK 4: Add Manual Tags (Optional)**

**What users do:**
1. Click the "Add Tag" button (floating button on screen)
2. Click anywhere on the screen preview where a tag is missing
3. Fill in the tag details:
   - Tag name (e.g., `promo_banner_click`)
   - Event type (Click, Page View, Form Submit)
   - Tracking level (Component, Page, Section)
4. Save the tag

**Outcome:** Manual tag appears on the screen. AI learns this pattern for future journeys

---

### **TASK 5: Ship the Package to Development**

**What users do:**
1. Ensure all tags are approved (progress shows 12/12)
2. Click the "Ship to Development" button (top-right header)
3. Confirm shipment in the modal
4. Wait 2-3 seconds for package generation

**Outcome:** 
- Developer receives a complete package with:
  - JSON specification file
  - Implementation guide
  - Testing checklist
- Journey status updates to "Shipped"
- Developer can start implementation immediately

---

## 🔄 Optional Supporting Tasks

### **View AI Context Sources**
- Click "AI Sources" to see what materials the AI analyzed
- Review Figma designs, Jira tickets, meeting transcripts
- Understand why AI made specific recommendations

### **Validate Coverage**
- Click "Validate" to check analytics coverage
- Review quality checks and compliance status
- See validation report (100% coverage, no errors)

### **Edit Journey Details**
- Expand "Show Details" section
- Edit the measurement goal description
- Modify data layer variables
- Update business context

### **Track Implementation History**
- Go to Tag Manager (History view)
- See past shipments and their status
- Monitor developer progress
- Review completed implementations

---

## 📊 Typical Workflow (15 Minutes)

```
1. Select Journey (1 min)
   Browse library → Click "5G Upgrade Flow"

2. Review AI Tags (8 min)
   - Review 12 AI recommendations
   - Approve 10 tags
   - Edit 2 tags
   - Reject 0 tags

3. Add Manual Tag (2 min)
   - Notice missing promo banner tracking
   - Click screen, add manual tag

4. Correct AI (2 min - if needed)
   - AI used wrong rule
   - Chat: "Use Upgrade Eligibility Rule"
   - AI re-runs analysis

5. Ship Package (2 min)
   - All 12/12 tags approved
   - Click "Ship to Development"
   - Confirm and done!
```

**Total Time:** ~15 minutes per journey  
**Old Manual Process:** 8+ hours per journey  
**Time Saved:** 96%

---

## 🎯 Summary

**Main Tasks Users Perform:**

1. ✅ **Select** a customer journey from the library
2. ✅ **Review** AI-recommended tags (approve/edit/reject)
3. ✅ **Correct** AI using conversational commands (optional)
4. ✅ **Add** manual tags for missed interactions (optional)
5. ✅ **Ship** the validated package to developers

**That's it!** The AI handles all the heavy lifting:
- Analyzing screens
- Detecting interactions
- Recommending tag names
- Applying business rules
- Generating documentation
- Creating developer packages

Users just **review, approve, and ship**.

---

**Document Purpose:** Client presentation, training materials, executive briefings  
**Target Audience:** Business Analysts, Product Managers, Stakeholders
