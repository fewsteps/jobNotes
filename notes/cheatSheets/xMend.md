### TRANSACTION CODES

* **290:** Increase tax (+)
* **291:** Decrease tax (-)
* **160:** Increase FTF penalty (+)
* **161:** Decrease FTF penalty (-)
* **170:** Increase ES penalty (+)
* **171:** Decrease ES penalty (-)
* **270:** Increase FTP penalty (+) [- freeze]
* **271:** Decrease FTP penalty (-) [- freeze]
* **340:** Increase debit interest (+) [- freeze]
* **341:** Decrease debit interest (-) [- freeze]
* **770:** Increase credit interest (+) [- freeze]
* **771:** Decrease credit interest (-) [- freeze]

---

### REFERENCE NUMBERS

* **336:** Additional Child Tax Credit F8812 (+/-)
* **764:** Increase EITC (+)
* **765:** Decrease EITC (-)
* **766:** Form 2439, Form 4136, Offset Reversal (+)
* **767:** Forms 2439 Form 4136 (-)
* **806:** Increase withholding (-)
* **807:** Decrease withholding (-)
* **808:** Primary Injured Spouse Refund
* **809:** Secondary Injured Spouse Refund
* **678:** Primary Self-Employment Income (+/-)
* **879:** Secondary Self-Employment Income (+/-)
* **883:** Non-Conventional Fuels Credit (+/-)
* **884:** Alcohol Fuels Credit (+/-)
* **885:** Advanced EITC (+/-)
* **886:** Taxable Income (+/-)
* **887:** Personal Exemptions (+/-)
* **888:** Adjusted Gross Income (+/-)
* **889:** Self-Employment Tax (+/-)
* **891:** Primary Unreported Tip Income (+/-)
* **892:** Secondary Unreported Tip Income (+/-)
* **895:** Primary Medicare Income (+/-)
* **896:** Secondary Medicare Income (+/-)
* **898:** Primary Medicare Tip Income (+/-)
* **899:** Secondary Medicare Tip Income (+/-)

---

### BLOCKING SERIES

* **00:** Adjustment documents includes original TC 150. Becomes new controlling DLN.
* **05:** Normal, Non-refile, No TC 150, not controlling DLN.
* **18:** Refile, Becomes Controlling DLN. Pulls TC 150.
* **77:** Set Math Error (-G). Includes original TC 150.
* **78:** Set Math Error, Becomes Controlling. Pulls TC 150.
* **98:** Disallowance, Becomes Controlling. Pulls TC 150.
* **99:** Disallowance, Includes original TC 150.

---

### SOURCE CODES

* **0:** Suppressed, nothing prints on the notice.
* **1:** As you requested, we changed your account...
* **2:** We changed your account to correct your...
* **3:** Because of recent tax law changes, we changed...
* **4:** We changed your return to correct IRS error...
* **5:** We changed your return requested carryback...
* **6:** You made a mistake; we corrected the error...
* **7:** All or part of your refund offset is being reversed...

---

### PRIORITY CODES

* **1:** Used with a -L freeze and when both PC 1 and PC 8 are needed.
* **3:** IRS initiated adjustment when considering the 45-day interest free period.
* **5:** Use with TC 290.00 to force post accruals of unrestricted FTP penalty and/or interest.
* **6:** Use to release math error freeze (-G) when TP agrees to math error.
* **7:** Use to set unsubstantiated math error protest freeze to send to Exam.
* **8:** Use when inputting an adjustment within $10 of a prior adjustment; When EITC is increased and prior TC 290 on account; or When adjusting withholding and a TC 17X is posted.

---

### TRANSACTION CODE 971 ACTION CODES (Trans Date)

* **001:** TC150 to another tin/tax period (RRD)
* **002:** Amended/duplicate to another tin/tax period (23C date of 976/977)
* **003:** Reinput return from wrong tin/tax period
* **010:** Amended return forwarded to Adjustments
* **011:** Non-receipt of refund check
* **013:** Amended return forwarded to Exam
* **014:** Amended return forwarded to Statute
* **015:** Amended return forwarded to AUR
* **017:** For cross-reference, indicating that a return has posted to another TIN/MFT/TXPD (Receive dt of return)
* **030:** TC 848/849 refund reversal xref (23C date of 846/840)
* **035:** Failure to Pay 1% trigger
* **037:** Manual Refund Cross Reference TIN or Address
* **043:** Pending installment agreement
* **063:** New installment agreement
* **071:** DMF injured spouse claim (receive date of claim)
* **112:** AOTC, CTC, or EITC retroactive claims - allowed or disallowed
* **262:** Maximum Failure to Pay Penalty assessed
* **270:** Incomplete claim returned to taxpayer (date of claim)
* **522:** ID theft Initial allegation/suspicion OR documentation rec'd
* **501:** ID theft TP identified and impact on tax administration
* **504:** ID theft TP identified and tax impact is unknown
* **505:** ID theft IRS notified the taxpayer of data loss incident
* **506:** ID theft IRS identified and impact on tax administration

---

### TRANSACTION CODE 971 ACTION CODES FOR TPP & AQC

* **TPP: Taxpayer Protection Program - IRM 25.25.6**
* **111:** Return w/ matching DLN identified as IDT and moved to MFT 32
* **121:** Potential IDT case selected by TPP before return posts (used prior to 2017)
* **123:** Used by RIVO to give more information (TPP letter, etc.)
* **124:** Potential IDT case selected by TPP before return posts (used 2017 to present)
* **129:** Potential IDT case selected by TPP after return posts


* **AQC: Automated Questionable Credit Program - IRM 25.25.7**
* **122:** Selected for review after posting for withholding and/or credits
* **128:** Freezes ACA Exposure amount
* **140:** Account marked for potential illegal tax promotion



---

### IDRS STATUS FOR CC STAUP

| Status | Staups | Notice 19/21 |
| --- | --- | --- |
| **20** | XX | CP 21/14/11a |
| **56** | XX | CP 501 |
| **58** | XX | CP 503 |
| **22** | XX | CP 504 |
| **22/24/26** | TDI status |  |

---

### SOURCE DOCUMENT (SD)

* **Y:** Paper documents attached to label.
* **N:** No input documents. Nothing attached to label.
* **R:** Documents have been recharged to another area.

---

### HOLD CODES

* **0:** No other HC applies.
* **1:** Holds refund, allows adjustment notice.
* **2:** Holds refund delays adjustment notice.
* **3:** Stops adjustment notice, allows refund.
* **4:** Stops notice forever, holds refund.

---

### REASON CODES

* IRM 21.6.7-1 Revised 03/30/2020