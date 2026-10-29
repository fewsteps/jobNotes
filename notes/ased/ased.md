## Revenue Manual (IRM) Part 21 (Customer Account Services)**.

---

## Part 1: Core Concepts & Statute Expiration Dates

Before making any account adjustments, you must understand the three primary Statute Expiration Dates (SEDs). Managing statutes is a high-priority responsibility because allowing a statute to expire incorrectly can result in an improper tax assessment or illegal refund issuance.

### The Three Main Statute Expiration Dates

```
                +-----------------------------------------------+
                |            KEY STATUTE DATES (SEDs)           |
                +-----------------------------------------------+
                |                                               |
  ASED -------->| Assessment Statute Expiration Date            |
  (3 Years)     | Limits the time IRS can ASSESS additional tax |
                |                                               |
  RSED -------->| Refund Statute Expiration Date                |
  (3 Yrs/2 Yrs) | Limits the time IRS can ISSUE a refund/credit |
                |                                               |
  CSED -------->| Collection Statute Expiration Date            |
  (10 Years)    | Limits the time IRS can COLLECT an unpaid balance|
                +-----------------------------------------------+

```

#### 1. Assessment Statute Expiration Date (ASED)

* **What it is:** The legally defined deadline by which the IRS must assess additional tax against a taxpayer.
* **General Rule (IRC 6501):** Generally **3 years** from the date the original return was filed or the statutory due date (usually April 15), whichever is *later*.
* **Amended Return Impact:** Filing a Form 1040-X that increases tax **does not** automatically reset or extend the standard 3-year ASED unless specific conditions apply (e.g., received within 60 days of expiration under IRC 6501(c)(7)).
* **IRM Reference:** **IRM 21.2.4** (Statute Concepts) & **IRM 25.6** (Statute of Limitations).

#### 2. Refund Statute Expiration Date (RSED)

* **What it is:** The legal deadline by which a taxpayer must file a claim for a refund or credit of an overpayment.
* **General Rule (IRC 6511):** A claim for refund must be filed within:
* **3 years** from the time the original return was filed (or due date, whichever is later), **OR**
* **2 years** from the time the tax was paid, whichever period expires *later*.


* **Lookback Rule:** The amount of refund or credit the IRS can issue is limited to the tax paid within the lookback period (3 years plus extension periods, or 2 years immediately preceding the claim).
* **IRM Reference:** **IRM 21.5.3.2** (Claims for Refund/Credit) & **IRM 25.6.1**.

#### 3. Collection Statute Expiration Date (CSED)

* **What it is:** The time period during which the IRS can legally collect an assessed tax debt.
* **General Rule (IRC 6502):** Generally **10 years** from the date the tax liability was formally assessed (recorded on IDRS).
* **Amended Return Impact:** If an amended return results in an additional tax assessment, that *new assessment* gets its own brand-new 10-year CSED clock!
* **IRM Reference:** **IRM 21.2.4.3** & **IRM 5.1.19**.

---

### Special Circumstances & Statute Exceptions

* **Fraud / Intentional Evasion:** No ASED limit (unlimited time to assess).
* **Unfiled Original Returns:** The statute clock never starts until a valid original return is filed.
* **Substantial Omission of Income:** If more than 25% of gross income was omitted, the ASED expands to **6 years**.
* **Statute Suspensions (Tolling):** The running of statute clocks can be suspended (paused) by specific events such as **Bankruptcy**, **Offer in Compromise (OIC) processing**, **Collection Due Process (CDP) appeals**, or **Military Combat Zone service**.

---

## Part 2: Essential IDRS Research Tools & Freeze Codes

Before touching any numbers, you must perform full account research using the **Integrated Data Retrieval System (IDRS)**.

### Top Command Codes (CC) to Learn

1. **CC SUMRY:** Checks whether an account module or control base exists.
2. **CC TXMOD (with definer "A"):** Displays the detailed tax module, posted Transaction Codes (TCs), pending transactions, freeze codes, and status.
3. **CC ENMOD:** Displays entity information (name, address, TIN, filing status).
4. **CC ADJREQ:** The primary command code used to input adjustment transactions.

### Key Transaction Codes (TCs) on a Module

* **TC 150:** Original Return Filed & Initial Tax Assessed.
* **TC 290:** Additional Tax Assessed (Increase/Adjustment).
* **TC 291:** Abatement of Tax (Decrease in liability).
* **TC 570:** Refund Freeze / Hold applied to the module.
* **TC 971:** Action/Information Code (e.g., indicates correspondence sent, AUR/Exam activity, or attached claim).

### Common Account Freeze Codes (IRM 21.5.6)

Always check if any of these freeze codes appear on `CC TXMOD`:

| Freeze Code | Name / Meaning | Action Required |
| --- | --- | --- |
| **`-A` Freeze** | Audit / Examination involvement | DO NOT ADJUST. Refer to Exam or hold per IRM. |
| **`-L` Freeze** | Automated Underreporter (AUR) active | Check for active AUR (TC 922). |
| **`-V` Freeze** | Bankruptcy proceeding | Involves Insolvency; requires special handling/approval. |
| **`-Z` Freeze** | Criminal Investigation (CI) | **STOP IMMEDIATELY.** Do not inform taxpayer. |
| **`-W` / `-E` Freeze** | Duplicate Return / Identity Theft | Follow ID Theft/Dup Return protocol (IRM 21.6.2). |

---

## Part 3: Step-by-Step Amended Return Processing Guideline

Follow these **6 sequential steps** for every case assigned to you.

```
+-------------------------------------------------------------------+
|               6-STEP AMENDED RETURN WORKFLOW                      |
+-------------------------------------------------------------------+
| Step 1: Verify Claim Validity & Authorization                     |
| Step 2: Check IDRS Account Status & Freeze Codes                  |
| Step 3: Evaluate Statute Dates (ASED & RSED)                      |
| Step 4: Compare Original (TC 150) vs. Amended (1040-X)            |
| Step 5: Determine Processing Category (Allow / Disallow / Hold)   |
| Step 6: Input Adjustment (CC ADJREQ) or Escalate Case             |
+-------------------------------------------------------------------+

```

### Step 1: Verify Claim Validity & Authorization

1. Is the Form 1040-X signed and dated by the taxpayer(s)? *(If filing Jointly, both spouses must sign).*
2. Is the taxpayer's identity verified (Name, SSN/ITIN, Tax Year)?
3. Are necessary schedules/forms attached (e.g., revised Schedule C, Schedule D, or Form W-2 copies)?

### Step 2: Check Account Status on IDRS

1. Pull `CC TXMODA` for the tax year in question.
2. Verify that the original return (**TC 150**) has actually posted.
> ⚠️ **CRITICAL WARNING — Unsettled Accounts:** If the current-year return shows `00000000` in the TC 150 posted date field, the account is *unsettled*. **DO NOT ADJUST.** Reassign per IRM 21.5.2.3.


3. Check for open controls or pending adjustments (**TC 29X**, **TC 922** for AUR, **TC 420** for Exam).
4. Look for freeze codes (`-A`, `-L`, `-V`, `-Z`).

### Step 3: Check Statute Expiration Dates

1. **RSED Check (If the 1040-X requests a Refund/Decrease):**
* Was the 1040-X received within 3 years of the original return filing date/due date OR within 2 years of the tax payment?
* If **Expired:** The claim must be disallowed (statute-barred).


2. **ASED Check (If the 1040-X increases Tax/Liability):**
* Is the ASED within **90 to 180 days** of expiring? If so, follow special "imminent statute" procedures (IRM 25.6.1).



### Step 4: Compare Original Return vs. 1040-X

* Compare **Column A** (Original Amounts / Prior Adjustments) against the actual values on `CC TXMOD`/Transcript.
* Check **Column B** (Net Change) for math errors.
* Review **Column C** (Corrected Amounts).
* Read the taxpayer's **Explanation of Changes** on Part II of Form 1040-X.

### Step 5: Determine Adjustment Category

1. **Tax Increase (Additional Tax Due):** Generally processed using **TC 290** with appropriate Reason Code.
2. **Tax Decrease / Refund Claim:** Processed using **TC 291** (Abatement) or credit adjustments, provided RSED is open and verified.
3. **No-Change / Informational:** If the changes cancel each other out or don't affect tax liability.

### Step 6: Input Action or Reassign Case

* If all criteria are met and within your authority limit: Input adjustment via `CC ADJREQ`.
* If a hold/freeze applies or outside authority: Transfer/reassign to appropriate department or lead.

---

## Part 4: High-Level End-to-End Flowchart

```
                 [Receive Form 1040-X Case]
                             |
                             v
                 [Step 1: Check Signature & Forms]
                             |
                   Is form valid & signed?
                   /                     \
               (NO)                       (YES)
                 |                          |
    [Request Info / Reject]                 v
                                 [Step 2: Pull CC TXMODA]
                                            |
                                  Is TC 150 Posted & Settled?
                                  /                         \
                              (NO)                           (YES)
                                |                              |
                   [Hold / Wait for Settlement]                v
                                                    Are Freeze Codes Present?
                                                    (-A, -L, -V, -Z, etc.)
                                                    /                    \
                                                (YES)                     (NO)
                                                  |                         |
                                       [STOP & Route/Escalate]              v
                                                                [Step 3: Check RSED/ASED]
                                                                            |
                                                                   Is Claim Within Statute?
                                                                   /                      \
                                                               (NO)                        (YES)
                                                                 |                           |
                                                       [Disallow Claim / Notice]             v
                                                                                   [Step 4 & 5: Audit Math
                                                                                    & Determine Category]
                                                                                             |
                                                                                   Within CSR Authority?
                                                                                   /                   \
                                                                               (NO)                     (YES)
                                                                                 |                        |
                                                                        [Refer to Supervisor]   [Step 6: Input TC 290/291
                                                                                                 via CC ADJREQ]

```

---

## Part 5: Red Flags — When to STOP & Seek Guidance

As a new CSR, **knowing when NOT to adjust an account is just as important as knowing how to adjust one.** Immediately stop work and consult your Lead CSR, Instructor, or Manager under the following scenarios:

> 🛑 **STOP AND ESCALATE IF:**
> 1. **Statute Expiration is Imminent:** RSED or ASED expires within **90 days** (requires immediate statute control routing).
> 2. **Audit / Exam Freeze (`-A` Freeze or TC 420/421):** The return is actively being audited. Adjusting the account will corrupt Exam's findings.
> 3. **Criminal Investigation (`-Z` Freeze):** Never take any action or communicate with the taxpayer regarding CI accounts.
> 4. **Automated Underreporter (`TC 922` / `-L` Freeze):** AUR has an active case for unreported income. Reassign per IRM 21.3.1.
> 5. **Dollar Limit Exceeded:** The requested adjustment exceeds your official Accounts Management dollar-delegation authority limit.
> 6. **Complex Tax Topics:** Involves complex foreign income/withholding (e.g., Form 1042-S), bankruptcy/insolvency (TC 604), or complex carrybacks/carryforwards.
> 7. **Suspected Identity Theft or Fraud:** Multiple returns submitted under the same TIN with conflicting information.
> 
> 

---

## Part 6: Summary of Relevant IRM Sections

Keep these key references handy on your desktop for quick verification:

* **IRM 21.5.1:** General Adjustments Overview
* **IRM 21.5.2:** Adjustment Guidelines & IDRS Research
* **IRM 21.5.3:** General Claims Procedures (Form 1040-X)
* **IRM 21.5.4:** General Math Error Procedures
* **IRM 21.5.6:** Account Freeze Codes
* **IRM 21.2.4:** Statute Expiration Concepts
* **IRM 25.6.1:** Statute of Limitations Procedures

---

### Tip for Your First Day on the Floor:

Always use your **IAT (Integrated Automation Technologies)** tools (such as the *xMend* tool and *Code Search Index*). They will help guide your command code inputs and check for system errors automatically. Take your time, verify your command codes twice before striking Enter on `CC ADJREQ`, and never hesitate to double-check with your lead!