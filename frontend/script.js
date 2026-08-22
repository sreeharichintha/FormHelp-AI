// ================================
// FormHelp AI - File Upload Preview
// ================================

const uploadButton =
    document.querySelector(".hero .primary-btn");

const fileInput =
    document.createElement("input");


// ================================
// File Input Settings
// ================================

fileInput.type = "file";

fileInput.accept =
    ".jpg,.jpeg,.png,.pdf";

fileInput.style.display = "none";

document.body.appendChild(fileInput);


// ================================
// Create Preview Area
// ================================

const previewBox =
    document.createElement("div");

previewBox.className =
    "upload-preview";

previewBox.innerHTML = `

    <div class="preview-header">

        <h3>
            📄 Your Form
        </h3>

        <button class="remove-file">
            ✕
        </button>

    </div>


    <div class="preview-content"></div>


    <button class="analyze-btn">
        🔍 Analyze Form
    </button>

`;

previewBox.style.display =
    "none";


document
    .querySelector(".hero-content")
    .appendChild(previewBox);


// ================================
// Upload Button
// ================================

if (uploadButton) {

    uploadButton.addEventListener(
        "click",
        function () {

            fileInput.click();

        }
    );

}


// ================================
// File Selected
// ================================

fileInput.addEventListener(
    "change",
    function () {

        const file =
            fileInput.files[0];

        if (!file) {
            return;
        }


        const previewContent =
            previewBox.querySelector(
                ".preview-content"
            );


        previewContent.innerHTML =
            "";


        // ============================
        // IMAGE PREVIEW
        // ============================

        if (
            file.type.startsWith(
                "image/"
            )
        ) {

            const image =
                document.createElement(
                    "img"
                );


            image.src =
                URL.createObjectURL(
                    file
                );


            image.alt =
                "Uploaded form";


            image.className =
                "form-image";


            previewContent.appendChild(
                image
            );

        }


        // ============================
        // PDF PREVIEW
        // ============================

        else if (
            file.type ===
            "application/pdf"
        ) {

            previewContent.innerHTML = `

                <div class="pdf-preview">

                    <div class="pdf-icon">
                        📕
                    </div>

                    <h4>
                        ${file.name}
                    </h4>

                    <p>
                        PDF form selected successfully.
                    </p>

                </div>

            `;

        }


        // ============================
        // SHOW PREVIEW
        // ============================

        previewBox.style.display =
            "block";


        previewBox.scrollIntoView({

            behavior: "smooth",

            block: "center"

        });

    }
);


// ================================
// Remove File
// ================================

previewBox
    .querySelector(".remove-file")
    .addEventListener(
        "click",
        function () {

            fileInput.value =
                "";

            previewBox.style.display =
                "none";

        }
    );


// ================================
// Analyze Button - Real OCR
// ================================

previewBox
    .querySelector(".analyze-btn")
    .addEventListener(
        "click",
        async function () {

            const analyzeButton =
                previewBox.querySelector(
                    ".analyze-btn"
                );


            const file =
                fileInput.files[0];


            if (!file) {

                alert(
                    "Please upload a form first."
                );

                return;

            }


            analyzeButton.innerHTML =
                "🔄 Reading Form...";


            analyzeButton.disabled =
                true;


            try {

                const formData =
                    new FormData();


                formData.append(
                    "file",
                    file
                );


                // ========================
                // Backend Request
                // ========================

                const response =
                    await fetch(
                        "https://formhelp-ai.onrender.com/upload",
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "OCR Response:",
                    data
                );


                // ========================
                // Check OCR Response
                // ========================

                if (
                    !response.ok ||
                    data.status !==
                    "success"
                ) {

                    throw new Error(
                        data.message ||
                        "OCR analysis failed."
                    );

                }


                analyzeButton.innerHTML =
                    "✅ Form Analyzed";


                showOCRResult(
                    data
                );


            }

            catch (error) {

                console.error(
                    "OCR Error:",
                    error
                );


                analyzeButton.innerHTML =
                    "❌ Analysis Failed";


                alert(
                    "FormHelp AI Error:\n\n" +
                    error.message
                );


                analyzeButton.disabled =
                    false;

            }

        }
    );


// ================================
// Basic Analysis Result
// ================================

function showAnalysisResult(data) {

    const result =
        document.createElement(
            "div"
        );


    result.className =
        "analysis-result";


    result.innerHTML = `

        <div class="result-header">

            <span>
                🤖
            </span>

            <div>

                <small>
                    BACKEND CONNECTED
                </small>

                <h2>
                    Form Received
                </h2>

            </div>

        </div>


        <div class="result-card">

            <h3>
                📄 File Information
            </h3>


            <p>
                Your form has been successfully
                received by FormHelp AI.
            </p>


            <div class="result-item">

                <strong>
                    📋 File Name
                </strong>

                <span>
                    ${data.filename}
                </span>

            </div>


            <div class="result-item">

                <strong>
                    🤖 AI Analysis
                </strong>

                <span>
                    Next Step
                </span>

            </div>

        </div>


        <!-- ================================
             Extracted Form Text
        ================================= -->

        <div class="result-card extracted-text-card">

            <h3>
                📄 Extracted Form Text
            </h3>

            <div class="extracted-text">

                ${data.text || "No text extracted."}

            </div>

        </div>


        <button class="continue-btn">

            💡 View Field Guidance

        </button>

    `;


    previewBox.appendChild(
        result
    );


    result.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });


    // Translate extracted text
    // if another language is selected

    translateExtractedText(
        result
    );

}
// ================================
// Display OCR Result
// ================================

function showOCRResult(data) {

    const extractedText =
        data.text || "";


    // ================================
    // Detect Fields
    // ================================

    const fields =
        detectFields(extractedText);


    // ================================
    // Detect Documents
    // ================================

    const documents =
        detectDocuments(extractedText);


    // ================================
    // Create Result
    // ================================

    const result =
        document.createElement("div");


    result.className =
        "analysis-result";


    result.innerHTML = `

        <div class="result-header">

            <span>
                🤖
            </span>

            <div>

                <small>
                    OCR COMPLETED
                </small>

                <h2>
                    Form Text Detected
                </h2>

            </div>

        </div>


        <div class="result-card">
                    <h3>
                📄 Extracted Form Text
            </h3>


            <div
                class="extracted-text"
                data-original-text="${escapeHTML(extractedText)}"
            >

                ${escapeHTML(extractedText)}

            </div>

        </div>


        <!-- =========================
             Field Guidance
        ========================== -->

        <div class="field-guidance">

            <h3>
                💡 Field Guidance
            </h3>


            ${
                fields.length > 0

                ? fields.map(
                    (field, index) => `

                    <div class="field-item">

                        <h4>
                            ${index + 1}.
                            ${escapeHTML(field.name)}
                        </h4>


                        <p>
                            <strong>
                                What it means:
                            </strong>

                            ${escapeHTML(field.meaning)}
                        </p>


                        <p>
                            <strong>
                                What to enter:
                            </strong>

                            ${escapeHTML(field.example)}
                        </p>

                    </div>

                `
                ).join("")

                : `

                    <p>
                        No specific fields detected.
                    </p>

                `
            }

        </div>


        <!-- =========================
             Required Documents
        ========================== -->

        <div class="documents-section">

            <h3>
                📑 Required Documents
            </h3>


            ${
                documents.length > 0

                ? documents.map(
                    document => `

                    <div class="document-item">

                        <span>
                            ☐
                        </span>

                        <strong>
                            ${escapeHTML(document)}
                        </strong>

                    </div>

                `
                ).join("")

                : `

                    <p>
                        No specific documents detected
                        from this form.
                    </p>

                `
            }

        </div>
        <div class="voice-controls">

    <button class="listen-btn">
        🔊 Listen
    </button>

    <button class="stop-btn">
        ⏹ Stop
    </button>

    </div>  
        <button class="continue-btn">

            💡 View Field Guidance

        </button>

    `;


    previewBox.appendChild(
        result
    );
    // ====================================
// Voice Controls
// ====================================

const listenButton =
    result.querySelector(
        ".listen-btn"
    );

const stopButton =
    result.querySelector(
        ".stop-btn"
    );


if (listenButton) {

    listenButton.addEventListener(
        "click",
        function () {

            speakExtractedText(
                result
            );

        }
    );

}


if (stopButton) {

    stopButton.addEventListener(
        "click",
        function () {

            stopSpeaking();

        }
    );

}

    // ================================
    // Apply Current Language
    // ================================

    applyResultLanguage(result);

    updateExtractedTextLanguage(
        result,
        currentLanguage
    );


    result.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}


// ====================================
// Detect Fields
// ====================================

function detectFields(text) {

    const fields = [];


    const fieldRules = [

        {
            keywords: [
                "Full Name",
                "Name of Applicant"
            ],

            meaning:
                "Enter your complete name exactly as shown on your official document.",

            example:
                "Example: Sreehari Chinta"
        },


        {
            keywords: [
                "Father's",
                "Father",
                "Guardian"
            ],

            meaning:
                "Enter your father's or guardian's complete name.",

            example:
                "Example: Ramesh Chinta"
        },


        {
            keywords: [
                "Mother's",
                "Mother"
            ],

            meaning:
                "Enter your mother's complete name.",

            example:
                "Example: Lakshmi Chinta"
        },


        {
            keywords: [
                "Date of Birth",
                "DOB"
            ],

            meaning:
                "Enter your date of birth in the format requested by the form.",

            example:
                "Example: 15/08/2006"
        },


        {
            keywords: [
                "Gender"
            ],

            meaning:
                "Select the gender option that applies to you.",

            example:
                "Example: Male / Female"
        },


        {
            keywords: [
                "Category"
            ],

            meaning:
                "Select your applicable category.",

            example:
                "Example: SC / ST / BC / EBC / Minority"
        },


        {
            keywords: [
                "Religion"
            ],

            meaning:
                "Enter or select your religion if required by the form.",

            example:
                "Example: Hindu"
        },


        {
            keywords: [
                "Aadhar",
                "Aadhaar"
            ],

            meaning:
                "Enter your Aadhaar number as shown on your Aadhaar card.",

            example:
                "Example: 1234 5678 9012"
        },


        {
            keywords: [
                "Mobile Number",
                "Mobile"
            ],

            meaning:
                "Enter an active mobile number that you can access.",

            example:
                "Example: 9876543210"
        },


        {
            keywords: [
                "Email ID",
                "Email"
            ],

            meaning:
                "Enter an active email address.",

            example:
                "Example: name@example.com"
        },


        {
            keywords: [
                "Institution",
                "College"
            ],

            meaning:
                "Enter the official name of your college or educational institution.",

            example:
                "Example: Srinivasa Ramanujan Institute of Technology"
        },


        {
            keywords: [
                "Course Name",
                "Course"
            ],

            meaning:
                "Enter the name of the course you are currently studying.",

            example:
                "Example: B.Tech Computer Science and Engineering"
        },


        {
            keywords: [
                "Course Year",
                "Year of Study"
            ],

            meaning:
                "Enter your current year of study.",

            example:
                "Example: 3rd Year"
        },


        {
            keywords: [
                "Hall Ticket Number"
            ],

            meaning:
                "Enter the hall ticket number issued by your institution.",

            example:
                "Example: 21A01A0501"
        },


        {
            keywords: [
                "Admission Number"
            ],

            meaning:
                "Enter the admission number provided by your college.",

            example:
                "Example: ADM2026001"
        },


        {
            keywords: [
                "Academic Year"
            ],

            meaning:
                "Enter the academic year applicable to your application.",

            example:
                "Example: 2026-27"
        },


        {
            keywords: [
                "Annual Family Income",
                "Family Income"
            ],

            meaning:
                "Enter the total income earned by your family in one year.",

            example:
                "Example: ₹2,50,000"
        },


        {
            keywords: [
                "Income Certificate Enclosed"
            ],

            meaning:
                "Select Yes if you are submitting the required income certificate; otherwise select No.",

            example:
                "Example: Yes"
        },


        {
            keywords: [
                "Income Certificate Number"
            ],

            meaning:
                "Enter the certificate number printed on your income certificate.",

            example:
                "Example: IC123456789"
        },


        {
            keywords: [
                "Permanent Address"
            ],

            meaning:
                "Enter your permanent residential address.",

            example:
                "Example: House No, Street, Village, District, State"
        },


        {
            keywords: [
                "Correspondence Address"
            ],

            meaning:
                "Enter the address where you currently receive official communication.",

            example:
                "Example: House No, Street, City, State"
        },


        {
            keywords: [
                "Place"
            ],

            meaning:
                "Enter the place where the application is being submitted or signed.",

            example:
                "Example: Anantapur"
        },


        {
            keywords: [
                "Signature"
            ],

            meaning:
                "Sign the form in the designated signature area.",

            example:
                "Example: Student Signature"
        },


        {
            keywords: [
                "Admission / College ID",
                "College ID"
            ],

            meaning:
                "Provide your valid admission or college identification document.",

            example:
                "Example: College ID Card"
        }

    ];


    fieldRules.forEach(
        rule => {

            const found =
                rule.keywords.some(
                    keyword =>
                        text.toLowerCase()
                            .includes(
                                keyword.toLowerCase()
                            )
                );


            if (found) {

                fields.push({

                    name:
                        rule.keywords[0],

                    meaning:
                        rule.meaning,

                    example:
                        rule.example

                });

            }

        }
    );


    return fields;

}


// ====================================
// Detect Documents
// ====================================

function detectDocuments(text) {

    const documents = [];
const documentRules = [

        "Aadhar Card",

        "Aadhaar Card",

        "Admission / College ID",

        "SSC Marks Memo",

        "Caste Certificate",

        "Income Certificate",

        "Bank Passbook",

        "Bonafide Certificate",

        "Recent Photograph",

        "Passport Size Photo",

        "Other"

    ];


    documentRules.forEach(
        document => {

            if (
                text.toLowerCase()
                    .includes(
                        document.toLowerCase()
                    )
            ) {

                if (
                    !documents.includes(
                        document
                    )
                ) {

                    documents.push(
                        document
                    );

                }

            }

        }
    );


    return documents;

}


// ====================================
// Escape HTML
// ====================================

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// ====================================
// Result Language
// Part 3 will complete this system
// ====================================

function applyResultLanguage(result) {

    if (
        typeof translateResult ===
        "function"
    ) {

        translateResult(
            result
        );

    }

}
// ================================
// FormHelp AI - Multilanguage System
// Part 3
// ================================


// ====================================
// Translation Dictionary
// ====================================

var translations = {

    // ================================
    // ENGLISH
    // ================================

    en: {

        english: "English",

        fieldGuidance: "💡 Field Guidance",

        requiredDocuments:
            "📑 Required Documents",

        whatItMeans:
            "What it means:",

        whatToEnter:
            "What to enter:",

        noFields:
            "No specific fields detected.",

        noDocuments:
            "No specific documents detected from this form.",

        formText:
            "📄 Extracted Form Text",

        ocrCompleted:
            "OCR COMPLETED",

        formDetected:
            "Form Text Detected"

    },


    // ================================
    // TELUGU
    // ================================

    te: {

        english: "తెలుగు",

        fieldGuidance:
            "💡 ఫీల్డ్ మార్గదర్శకం",

        requiredDocuments:
            "📑 అవసరమైన పత్రాలు",

        whatItMeans:
            "దీని అర్థం:",

        whatToEnter:
            "ఏమి నమోదు చేయాలి:",

        noFields:
            "నిర్దిష్ట ఫీల్డ్‌లు గుర్తించబడలేదు.",

        noDocuments:
            "ఈ ఫారమ్‌లో నిర్దిష్ట పత్రాలు గుర్తించబడలేదు.",

        formText:
            "📄 గుర్తించిన ఫారం టెక్స్ట్",

        ocrCompleted:
            "OCR పూర్తయింది",

        formDetected:
            "ఫారమ్ టెక్స్ట్ గుర్తించబడింది"

    },


    // ================================
    // HINDI
    // ================================

    hi: {

        english: "हिन्दी",

        fieldGuidance:
            "💡 फ़ील्ड मार्गदर्शन",

        requiredDocuments:
            "📑 आवश्यक दस्तावेज़",

        whatItMeans:
            "इसका अर्थ:",

        whatToEnter:
            "क्या दर्ज करें:",

        noFields:
            "कोई विशिष्ट फ़ील्ड नहीं मिली।",

        noDocuments:
            "इस फॉर्म में कोई विशिष्ट दस्तावेज़ नहीं मिला।",

        formText:
            "📄 निकाला गया फॉर्म टेक्स्ट",

        ocrCompleted:
            "OCR पूरा हुआ",

        formDetected:
            "फॉर्म टेक्स्ट मिला"

    },


    // ================================
    // TAMIL
    // ================================

    ta: {

        english: "தமிழ்",

        fieldGuidance:
            "💡 புல வழிகாட்டி",

        requiredDocuments:
            "📑 தேவையான ஆவணங்கள்",

        whatItMeans:
            "இதன் பொருள்:",

        whatToEnter:
            "எதை உள்ளிட வேண்டும்:",

        noFields:
            "குறிப்பிட்ட புலங்கள் எதுவும் கண்டறியப்படவில்லை.",

        noDocuments:
            "இந்த படிவத்தில் குறிப்பிட்ட ஆவணங்கள் எதுவும் கண்டறியப்படவில்லை.",

        formText:
            "📄 பிரித்தெடுக்கப்பட்ட படிவ உரை",

        ocrCompleted:
            "OCR முடிந்தது",

        formDetected:
            "படிவ உரை கண்டறியப்பட்டது"

    },


    // ================================
    // KANNADA
    // ================================

    kn: {

        english: "ಕನ್ನಡ",

        fieldGuidance:
            "💡 ಕ್ಷೇತ್ರ ಮಾರ್ಗದರ್ಶನ",

        requiredDocuments:
            "📑 ಅಗತ್ಯವಿರುವ ದಾಖಲೆಗಳು",

        whatItMeans:
            "ಇದರ ಅರ್ಥ:",

        whatToEnter:
            "ಏನು ನಮೂದಿಸಬೇಕು:",

        noFields:
            "ನಿರ್ದಿಷ್ಟ ಕ್ಷೇತ್ರಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",

        noDocuments:
            "ಈ ನಮೂನೆಯಲ್ಲಿ ನಿರ್ದಿಷ್ಟ ದಾಖಲೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",

        formText:
            "📄 ಹೊರತೆಗೆದ ನಮೂನೆ ಪಠ್ಯ",

        ocrCompleted:
            "OCR ಪೂರ್ಣಗೊಂಡಿದೆ",

        formDetected:
            "ನಮೂನೆ ಪಠ್ಯ ಕಂಡುಬಂದಿದೆ"

    },


    // ================================
    // MALAYALAM
    // ================================

    ml: {

        english: "മലയാളം",

        fieldGuidance:
            "💡 ഫീൽഡ് മാർഗ്ഗനിർദ്ദേശം",

        requiredDocuments:
            "📑 ആവശ്യമായ രേഖകൾ",

        whatItMeans:
            "ഇതിന്റെ അർത്ഥം:",

        whatToEnter:
            "എന്താണ് നൽകേണ്ടത്:",

        noFields:
            "നിർദ്ദിഷ്ട ഫീൽഡുകൾ കണ്ടെത്തിയില്ല.",

        noDocuments:
            "ഈ ഫോമിൽ നിർദ്ദിഷ്ട രേഖകൾ കണ്ടെത്തിയില്ല.",

        formText:
            "📄 എക്സ്ട്രാക്റ്റ് ചെയ്ത ഫോം ടെക്സ്റ്റ്",

        ocrCompleted:
            "OCR പൂർത്തിയായി",

        formDetected:
            "ഫോം ടെക്സ്റ്റ് കണ്ടെത്തി"

    },


    // ================================
    // MARATHI
    // ================================

    mr: {

        english: "मराठी",

        fieldGuidance:
            "💡 फील्ड मार्गदर्शन",

        requiredDocuments:
            "📑 आवश्यक कागदपत्रे",

        whatItMeans:
            "याचा अर्थ:",

        whatToEnter:
            "काय भरावे:",

        noFields:
            "विशिष्ट फील्ड आढळले नाहीत.",

        noDocuments:
            "या फॉर्ममध्ये विशिष्ट कागदपत्रे आढळली नाहीत.",

        formText:
            "📄 काढलेला फॉर्म मजकूर",

        ocrCompleted:
            "OCR पूर्ण झाले",

        formDetected:
            "फॉर्म मजकूर आढळला"

    },


    // ================================
    // BENGALI
    // ================================

    bn: {

        english: "বাংলা",

        fieldGuidance:
            "💡 ফিল্ড নির্দেশিকা",

        requiredDocuments:
            "📑 প্রয়োজনীয় নথি",

        whatItMeans:
            "এর অর্থ:",

        whatToEnter:
            "কী লিখতে হবে:",

        noFields:
            "কোনো নির্দিষ্ট ফিল্ড পাওয়া যায়নি।",

        noDocuments:
            "এই ফর্মে কোনো নির্দিষ্ট নথি পাওয়া যায়নি।",

        formText:
            "📄 নিষ্কাশিত ফর্মের লেখা",

        ocrCompleted:
            "OCR সম্পন্ন হয়েছে",

        formDetected:
            "ফর্মের লেখা শনাক্ত হয়েছে"

    }

};


// ====================================
// Current Language
// ====================================

var currentLanguage = "en";

// ====================================
// Get Current Language
// ====================================

function getCurrentLanguage() {

    return currentLanguage;

}


// ====================================
// Translate Result
// ====================================

// ====================================
// Translate Complete OCR Result
// ====================================

async function translateResult(result) {

    if (!result) {
        return;
    }

    const language = currentLanguage;

    const dictionary = translations[language];

    if (!dictionary) {
        return;
    }


    // ====================================
    // Field Guidance Heading
    // ====================================

    const guidanceHeading =
        result.querySelector(
            ".field-guidance h3"
        );

    if (guidanceHeading) {

        guidanceHeading.textContent =
            dictionary.fieldGuidance;

    }


    // ====================================
    // Required Documents Heading
    // ====================================

    const documentsHeading =
        result.querySelector(
            ".documents-section h3"
        );

    if (documentsHeading) {

        documentsHeading.textContent =
            dictionary.requiredDocuments;

    }


    // ====================================
    // What it means / What to enter
    // ====================================

    result
        .querySelectorAll(
            ".field-item"
        )
        .forEach(function (fieldItem) {

            const paragraphs =
                fieldItem.querySelectorAll("p");


            paragraphs.forEach(
                function (paragraph) {

                    const strong =
                        paragraph.querySelector("strong");

                    if (!strong) {
                        return;
                    }


                    const originalLabel =
                        strong.dataset.originalLabel ||
                        strong.textContent.trim();


                    strong.dataset.originalLabel =
                        originalLabel;


                    if (
                        originalLabel
                            .toLowerCase()
                            .includes("what it means")
                    ) {

                        strong.textContent =
                            dictionary.whatItMeans;

                    }


                    else if (
                        originalLabel
                            .toLowerCase()
                            .includes("what to enter")
                    ) {

                        strong.textContent =
                            dictionary.whatToEnter;

                    }

                }
            );

        });


    // ====================================
    // Empty Field Message
    // ====================================

    const fieldGuidance =
        result.querySelector(
            ".field-guidance"
        );


    if (fieldGuidance) {

        fieldGuidance
            .querySelectorAll("p")
            .forEach(function (paragraph) {

                const originalText =
                    paragraph.dataset.originalText ||
                    paragraph.textContent.trim();


                paragraph.dataset.originalText =
                    originalText;


                if (
                    originalText.includes(
                        "No specific fields detected."
                    )
                ) {

                    paragraph.textContent =
                        dictionary.noFields;

                }

            });

    }


    // ====================================
    // Empty Document Message
    // ====================================

    const documentSection =
        result.querySelector(
            ".documents-section"
        );


    if (documentSection) {

        documentSection
            .querySelectorAll("p")
            .forEach(function (paragraph) {

                const originalText =
                    paragraph.dataset.originalText ||
                    paragraph.textContent.trim();


                paragraph.dataset.originalText =
                    originalText;


                if (
                    originalText.includes(
                        "No specific documents detected"
                    )
                ) {

                    paragraph.textContent =
                        dictionary.noDocuments;

                }

            });

    }


    // ====================================
    // Translate Field Guidance Content
    // ====================================

    if (language !== "en") {

        const fieldItems =
            result.querySelectorAll(
                ".field-item"
            );


        for (
            const fieldItem of fieldItems
        ) {

            const paragraphs =
                fieldItem.querySelectorAll("p");


            for (
                const paragraph of paragraphs
            ) {

                const strong =
                    paragraph.querySelector("strong");

                if (!strong) {
                    continue;
                }


                // Save original paragraph text
                if (
                    !paragraph.dataset.originalText
                ) {

                    paragraph.dataset.originalText =
                        paragraph.textContent
                            .trim();

                }


                const originalParagraph =
                    paragraph.dataset.originalText;


                // Remove label from content
                let content =
                    originalParagraph;


                if (
                    content
                        .toLowerCase()
                        .startsWith("what it means:")
                ) {

                    content =
                        content.substring(
                            "What it means:".length
                        ).trim();

                }


                else if (
                    content
                        .toLowerCase()
                        .startsWith("what to enter:")
                ) {

                    content =
                        content.substring(
                            "What to enter:".length
                        ).trim();

                }


                if (!content) {
                    continue;
                }


                const translated =
                    await translateExtractedText(
                        content,
                        language
                    );


                if (
                    paragraph.contains(strong)
                ) {

                    paragraph.innerHTML =
                        `<strong>${strong.textContent}</strong> ${escapeHTML(translated)}`;

                }

            }

        }

    }

}
// ================================
// Translate Extracted Form Text
// ================================

// ====================================
// Apply Result Language
// ====================================


// ====================================
// Main Page Translation
// ====================================

function translatePage(language) {

    if (
        !translations[language]
    ) {

        language = "en";

    }


    currentLanguage =
        language;


    // ================================
    // Static Page Elements
    // ================================

    const elements =
        document.querySelectorAll(
            "[data-i18n]"
        );


    elements.forEach(
        function (element) {

            const key =
                element.dataset.i18n;


            if (
                translations[language] &&
                translations[language][key]
            ) {

                element.textContent =
                    translations[language][key];

            }

        }
    );


    // ================================
    // Existing OCR Results
    // ================================

    document
        .querySelectorAll(
            ".analysis-result"
        )
        .forEach(
            function (result) {

                translateResult(result);
                updateExtractedTextLanguage(
                    result,
                    language
                );

            }
        );

}
// ================================
// Translate Extracted OCR Text
// ================================

async function translateExtractedText(text, language) {

    if (!text || language === "en") {
        return text;
    }

    try {

        const response = await fetch(
            "https://formhelp-ai.onrender.com/translate",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    text: text,
                    target_language: language
                })
            }
        );

        if (!response.ok) {
            throw new Error(
                "Translation request failed: HTTP " +
                response.status
            );
        }

        const data =
            await response.json();

        if (
            data.status === "success" &&
            data.translated_text
        ) {
            return data.translated_text;
        }

        console.error(
            "Translation failed:",
            data.message ||
            "No translated text returned."
        );

        return text;

    } catch (error) {

        console.error(
            "Translation error:",
            error
        );

        // Never destroy OCR output if translation fails.
        return text;
    }
}


// ====================================
// Update Existing OCR Result Language
// ====================================

async function updateExtractedTextLanguage(result, language) {

    const extractedText =
        result.querySelector(".extracted-text");

    if (!extractedText) {
        return;
    }

    // Save original OCR text once so we never translate
    // an already translated result.
    if (!extractedText.dataset.originalText) {
        extractedText.dataset.originalText =
            extractedText.textContent.trim();
    }

    const originalText =
        extractedText.dataset.originalText;

    if (!originalText) {
        return;
    }

    // English always shows the original OCR text.
    if (language === "en") {
        extractedText.textContent =
            originalText;
        return;
    }

    // Prevent an older translation request from
    // overwriting a newer language selection.
    const requestId =
        Date.now().toString() +
        Math.random().toString();

    extractedText.dataset.translationRequest =
        requestId;

    const translatedText =
        await translateExtractedText(
            originalText,
            language
        );

    if (
        extractedText.dataset.translationRequest ===
        requestId
    ) {
        extractedText.textContent =
            translatedText;
    }
}
// ====================================
// FormHelp AI - Voice / Read Aloud
// ====================================

function getVoiceLanguage(language) {

    const voiceLanguages = {

        en: "en-US",
        te: "te-IN",
        hi: "hi-IN",
        bn: "bn-IN",
        ta: "ta-IN",
        kn: "kn-IN",
        ml: "ml-IN",
        mr: "mr-IN"

    };

    return voiceLanguages[language] || "en-US";
}


// ====================================
// Read Extracted Text Aloud
// ====================================

function speakExtractedText(result) {

    const extractedText =
        result.querySelector(".extracted-text");

    if (!extractedText) {
        return;
    }

    const text =
        extractedText.textContent.trim();

    if (!text) {
        return;
    }


    // Stop any previous speech
    window.speechSynthesis.cancel();


    const speech =
        new SpeechSynthesisUtterance(text);


    speech.lang =
        getVoiceLanguage(currentLanguage);


    speech.rate = 0.9;

    speech.pitch = 1;

    speech.volume = 1;


    // Try to find matching browser voice
    const voices =
        window.speechSynthesis.getVoices();


    const matchingVoice =
        voices.find(
            function (voice) {

                return voice.lang
                    .toLowerCase()
                    .startsWith(
                        speech.lang
                            .toLowerCase()
                            .split("-")[0]
                    );

            }
        );


    if (matchingVoice) {

        speech.voice =
            matchingVoice;

    }


    window.speechSynthesis.speak(
        speech
    );

}


// ====================================
// Stop Voice
// ====================================

function stopSpeaking() {

    window.speechSynthesis.cancel();

}

// ====================================
// Language Selector
// ====================================

const languageBtn =
    document.getElementById(
        "languageBtn"
    );


const languageMenu =
    document.getElementById(
        "languageMenu"
    );


if (
    languageBtn &&
    languageMenu
) {


    // ================================
    // Open Language Menu
    // ================================

    languageBtn.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            languageMenu.classList.toggle(
                "show"
            );

        }
    );


    // ================================
    // Close Menu
    // ================================

    document.addEventListener(
        "click",
        function () {

            languageMenu.classList.remove(
                "show"
            );

        }
    );


    // ================================
    // Language Selection
    // ================================

    languageMenu
        .querySelectorAll(
            "button"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.stopPropagation();


                        const selectedLanguage =
                            this.dataset.lang;


                        // ====================
                        // English
                        // ====================

                        if (
                            selectedLanguage ===
                            "en"
                        ) {

                            languageBtn.innerHTML =
                                "🌐 English ▾";

                            translatePage(
                                "en"
                            );

                        }


                        // ====================
                        // Telugu
                        // ====================

                        else if (
                            selectedLanguage ===
                            "te"
                        ) {

                            languageBtn.innerHTML =
                                "🌐 తెలుగు ▾";

                            translatePage(
                                "te"
                            );

                        }


                        // ====================
                        // Hindi
                        // ====================

                        else if (
                            selectedLanguage ===
                            "hi"
                        ) {

                            languageBtn.innerHTML =
                                "🌐 हिन्दी ▾";

                            translatePage(
                                "hi"
                            );

                        }


                        // ====================
                        // Tamil
                        // ====================

                        else if (
                            selectedLanguage ===
                            "ta"
                        ) {

                            languageBtn.innerHTML =
                                "🌐 தமிழ் ▾";

                            translatePage(
                                "ta"
                            );

                        }


                        // ====================
                        // Kannada
                        // ====================

                        else if (
                            selectedLanguage ===
                            "kn"
                        ) {

                            languageBtn.innerHTML =
                                "🌐 ಕನ್ನಡ ▾";

                            translatePage(
                                "kn"
                            );

                        }


                        // ====================
                        // Malayalam
                        // ====================

                        else if (
                            selectedLanguage ===
                            "ml"
                        ) {

                            languageBtn.innerHTML =
                                "🌐 മലയാളം ▾";

                            translatePage(
                                "ml"
                            );

                        }


                        // ====================
                        // Marathi
                        // ====================

                        else if (
                            selectedLanguage ===
                            "mr"
                        ) {

                            languageBtn.innerHTML =
                                "🌐 मराठी ▾";

                            translatePage(
                                "mr"
                            );

                        }


                        // ====================
                        // Bengali
                        // ====================

                        else if (
                            selectedLanguage ===
                            "bn"
                        ) {

                            languageBtn.innerHTML =
                                "🌐 বাংলা ▾";

                            translatePage(
                                "bn"
                            );

                        }


                        // ====================
                        // Close Menu
                        // ====================

                        languageMenu.classList.remove(
                            "show"
                        );

                    }
                );

            }
        );

}


// ====================================
// Initial Language
// ====================================

translatePage("en");
// ==========================================
// FormHelp AI - Supported Forms Explorer
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const formTypes = document.querySelector(".form-types");

    if (!formTypes) {
        return;
    }

    // ==========================================
    // FORM DATABASE
    // ==========================================

    const formData = {

        "Government Forms": {

            "Aadhaar": [
                {
                    name: "Aadhaar Enrolment / Update Form",
                    icon: "🪪",
                    description: "Aadhaar enrolment, update and correction form.",
                    link: "https://uidai.gov.in/en/my-aadhaar/about-your-aadhaar/updating-data-on-aadhaar.html"
                }
            ],

            "PAN Card": [
                {
                    name: "PAN Card Application",
                    icon: "💳",
                    description: "Apply for a new PAN card.",
                    link: "https://www.incometax.gov.in/iec/foportal/"
                },
                {
                    name: "PAN Correction",
                    icon: "✏️",
                    description: "Correction or update of PAN details.",
                    link: "https://www.incometax.gov.in/iec/foportal/"
                }
            ],

            "Passport": [
                {
                    name: "Fresh Passport Application",
                    icon: "📕",
                    description: "Apply for a new Indian passport.",
                    link: "https://www.passportindia.gov.in/"
                },
                {
                    name: "Passport Re-issue",
                    icon: "🔄",
                    description: "Apply for passport renewal or re-issue.",
                    link: "https://www.passportindia.gov.in/"
                }
            ],

            "Voter ID": [
                {
                    name: "New Voter Registration",
                    icon: "🗳️",
                    description: "Register as a new voter.",
                    link: "https://voters.eci.gov.in/"
                },
                {
                    name: "Voter ID Correction",
                    icon: "✏️",
                    description: "Update or correct voter details.",
                    link: "https://voters.eci.gov.in/"
                },
                {
                    name: "Address Change",
                    icon: "🏠",
                    description: "Update your voter address.",
                    link: "https://voters.eci.gov.in/"
                }
            ],

            "Driving Licence": [
                {
                    name: "Learner Licence",
                    icon: "🚗",
                    description: "Apply for a learner driving licence.",
                    link: "https://parivahan.gov.in/"
                },
                {
                    name: "Driving Licence",
                    icon: "🚘",
                    description: "Apply for a driving licence.",
                    link: "https://parivahan.gov.in/"
                },
                {
                    name: "Driving Licence Renewal",
                    icon: "🔄",
                    description: "Renew your driving licence.",
                    link: "https://parivahan.gov.in/"
                }
            ],

            "Ration Card": [
                {
                    name: "New Ration Card",
                    icon: "🍚",
                    description: "Apply for a new ration card.",
                    link: "https://nfsa.gov.in/"
                },
                {
                    name: "Ration Card Correction",
                    icon: "✏️",
                    description: "Update or correct ration card details.",
                    link: "https://nfsa.gov.in/"
                }
            ],

            "Income Certificate": [
                {
                    name: "Income Certificate",
                    icon: "💰",
                    description: "Apply for an income certificate.",
                    link: "https://services.india.gov.in/"
                }
            ],

            "Caste Certificate": [
                {
                    name: "Caste Certificate",
                    icon: "📜",
                    description: "Apply for a caste certificate.",
                    link: "https://services.india.gov.in/"
                }
            ],

            "Residence Certificate": [
                {
                    name: "Residence / Domicile Certificate",
                    icon: "🏠",
                    description: "Apply for residence or domicile certificate.",
                    link: "https://services.india.gov.in/"
                }
            ],

            "Birth Certificate": [
                {
                    name: "Birth Certificate",
                    icon: "👶",
                    description: "Apply for a birth certificate.",
                    link: "https://services.india.gov.in/"
                },
                {
                    name: "Birth Certificate Correction",
                    icon: "✏️",
                    description: "Correct details in a birth certificate.",
                    link: "https://services.india.gov.in/"
                }
            ],

            "Death Certificate": [
                {
                    name: "Death Certificate",
                    icon: "📜",
                    description: "Apply for a death certificate.",
                    link: "https://services.india.gov.in/"
                }
            ],

            "Pension": [
                {
                    name: "Government Pension Services",
                    icon: "👴",
                    description: "Access government pension services.",
                    link: "https://www.india.gov.in/"
                }
            ],

            "Farmer / Agriculture": [
                {
                    name: "Farmer Services",
                    icon: "🌾",
                    description: "Government services for farmers.",
                    link: "https://www.india.gov.in/"
                },
                {
                    name: "Agriculture Services",
                    icon: "🚜",
                    description: "Agriculture-related government services.",
                    link: "https://www.india.gov.in/"
                }
            ],

            "Education": [
                {
                    name: "Government Education Services",
                    icon: "🎓",
                    description: "Government education services.",
                    link: "https://www.india.gov.in/"
                }
            ],

            "Disability Certificate": [
                {
                    name: "Disability Certificate Services",
                    icon: "♿",
                    description: "Government disability certificate services.",
                    link: "https://www.india.gov.in/"
                }
            ],

            "Property / Land": [
                {
                    name: "Land Records",
                    icon: "🏡",
                    description: "Access government land record services.",
                    link: "https://www.india.gov.in/"
                },
                {
                    name: "Property Services",
                    icon: "🏠",
                    description: "Property-related government services.",
                    link: "https://www.india.gov.in/"
                }
            ],

            "Government Schemes": [
                {
                    name: "Government Scheme Applications",
                    icon: "🏛️",
                    description: "Explore government schemes and services.",
                    link: "https://www.india.gov.in/"
                }
            ]
        },


        // ==========================================
        // SCHOLARSHIP
        // ==========================================

        "Scholarship Forms": {

            "National Scholarship Portal": [
                {
                    name: "National Scholarship Portal",
                    icon: "🎓",
                    description: "Apply for scholarships through NSP.",
                    link: "https://scholarships.gov.in/"
                }
            ],

            "Post Matric Scholarship": [
                {
                    name: "Post Matric Scholarship",
                    icon: "📚",
                    description: "Post-matric scholarship services.",
                    link: "https://scholarships.gov.in/"
                }
            ]
        },


        // ==========================================
        // COLLEGE
        // ==========================================

        "College Forms": {

            "Admission": [
                {
                    name: "College Admission Form",
                    icon: "🏫",
                    description: "College admission related forms.",
                    link: "#"
                }
            ],

            "Scholarship": [
                {
                    name: "College Scholarship Form",
                    icon: "🎓",
                    description: "College scholarship related forms.",
                    link: "#"
                }
            ]
        },


        // ==========================================
        // JOBS
        // ==========================================

        "Job Applications": {

            "Government Jobs": [
                {
                    name: "UPSC Application",
                    icon: "🏛️",
                    description: "UPSC recruitment and applications.",
                    link: "https://upsconline.nic.in/"
                },
                {
                    name: "SSC Application",
                    icon: "💼",
                    description: "SSC recruitment applications.",
                    link: "https://ssc.gov.in/"
                }
            ]
        },


        // ==========================================
        // BANK
        // ==========================================

        "Bank Forms": {

            "Account Opening": [
                {
                    name: "Bank Account Opening",
                    icon: "🏦",
                    description: "Open a bank account.",
                    link: "#"
                }
            ],

            "KYC": [
                {
                    name: "Bank KYC Form",
                    icon: "🪪",
                    description: "Bank KYC related form.",
                    link: "#"
                }
            ]
        },


        // ==========================================
        // INSURANCE
        // ==========================================

        "Insurance Forms": {

            "Proposal": [
                {
                    name: "Insurance Proposal Form",
                    icon: "🛡️",
                    description: "Insurance proposal related form.",
                    link: "#"
                }
            ],

            "Claims": [
                {
                    name: "Insurance Claim Form",
                    icon: "📄",
                    description: "Insurance claim related form.",
                    link: "#"
                }
            ]
        }

    };


    // ==========================================
    // CREATE MODAL
    // ==========================================

    const modal = document.createElement("div");

    modal.className = "forms-modal";

    modal.innerHTML = `
        <div class="forms-modal-box">

            <button class="forms-close" type="button">
                ✕
            </button>

            <div class="forms-modal-header">
                <div class="forms-modal-icon">📄</div>

                <div>
                    <h2 class="forms-modal-title">
                        Supported Forms
                    </h2>

                    <p class="forms-modal-subtitle">
                        Select a form category
                    </p>
                </div>
            </div>

            <button
                class="forms-back-btn"
                type="button"
                style="display:none;"
            >
                ← Back
            </button>

            <div class="government-category-list"></div>

            <div class="government-form-list"></div>

        </div>
    `;

    document.body.appendChild(modal);


    const categoryList =
        modal.querySelector(".government-category-list");

    const formList =
        modal.querySelector(".government-form-list");

    const modalTitle =
        modal.querySelector(".forms-modal-title");

    const modalSubtitle =
        modal.querySelector(".forms-modal-subtitle");

    const backButton =
        modal.querySelector(".forms-back-btn");


    let currentMainCategory = null;


    // ==========================================
    // SHOW SUB CATEGORIES
    // ==========================================

    function showCategories(mainCategory) {

        currentMainCategory = mainCategory;

        categoryList.innerHTML = "";
        formList.innerHTML = "";

        categoryList.style.display = "grid";
        formList.style.display = "none";

        backButton.style.display = "none";

        modalTitle.textContent =
            "📂 " + mainCategory;

        modalSubtitle.textContent =
            "Select a form type";


        const categories =
            formData[mainCategory];


        Object.keys(categories).forEach(function (category) {

            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "government-category-btn";

            button.innerHTML = `
                <span class="category-icon">📄</span>

                <span class="category-name">
                    ${category}
                </span>

                <span class="category-arrow">
                    →
                </span>
            `;


            button.addEventListener(
                "click",
                function () {

                    showForms(
                        mainCategory,
                        category
                    );

                }
            );


            categoryList.appendChild(button);

        });

    }


    // ==========================================
    // SHOW ACTUAL FORMS
    // ==========================================

    function showForms(
        mainCategory,
        subCategory
    ) {

        categoryList.style.display = "none";
        formList.style.display = "grid";

        formList.innerHTML = "";

        backButton.style.display = "inline-flex";

        modalTitle.textContent =
            "📄 " + subCategory;

        modalSubtitle.textContent =
            mainCategory + "  ›  " + subCategory;


        const forms =
            formData[mainCategory][subCategory];


        forms.forEach(function (form) {

            const card =
                document.createElement("div");

            card.className =
                "government-form-card";


            card.innerHTML = `

                <div class="government-form-image">

                    <div class="form-preview-icon">
                        ${form.icon}
                    </div>

                    <span>
                        Official Form
                    </span>

                </div>


                <div class="government-form-info">

                    <h3>
                        ${form.name}
                    </h3>

                    <p>
                        ${form.description}
                    </p>

                    <div class="government-form-actions">

                        <a
                            href="${form.link}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="open-form-btn"
                        >
                            🔗 Open Form
                        </a>

                        ${
                            form.link !== "#"
                            ?
                            `
                            <a
                                href="${form.link}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="download-form-btn"
                            >
                                ⬇️ View / Download
                            </a>
                            `
                            :
                            `
                            <button
                                type="button"
                                class="download-form-btn disabled-form-btn"
                            >
                                Coming Soon
                            </button>
                            `
                        }

                    </div>

                </div>
            `;


            formList.appendChild(card);

        });

    }


    // ==========================================
    // BACK BUTTON
    // ==========================================

    backButton.addEventListener(
        "click",
        function () {

            if (currentMainCategory) {

                showCategories(
                    currentMainCategory
                );

            }

        }
    );


    // ==========================================
    // OPEN MAIN CATEGORY
    // ==========================================

    formTypes
        .querySelectorAll("div")
        .forEach(function (category) {

            category.style.cursor = "pointer";


            category.addEventListener(
                "click",
                function () {

                    const categoryName =
                        category.textContent
                            .replace(
                                /^[^\w]+/,
                                ""
                            )
                            .trim();


                    if (
                        formData[categoryName]
                    ) {

                        showCategories(
                            categoryName
                        );

                        modal.classList.add(
                            "show"
                        );

                    }

                }
            );

        });


    // ==========================================
    // CLOSE BUTTON
    // ==========================================

    modal
        .querySelector(".forms-close")
        .addEventListener(
            "click",
            function () {

                modal.classList.remove(
                    "show"
                );

            }
        );


    // ==========================================
    // CLICK OUTSIDE
    // ==========================================

    modal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === modal
            ) {

                modal.classList.remove(
                    "show"
                );

            }

        }
    );

});
/* =========================================================
   FormHelp AI - SMART FORM CHECK
   Upload → OCR → Detect Missing Fields → Result
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // GET ELEMENTS
    // ==========================================

    const smartFileInput =
        document.getElementById("smartFormFile");

    const smartUploadBtn =
        document.getElementById("smartUploadBtn");

    const smartUploadArea =
        document.getElementById("smartUploadArea");

    const smartFilePreview =
        document.getElementById("smartFilePreview");

    const smartFileName =
        document.getElementById("smartFileName");

    const smartFileSize =
        document.getElementById("smartFileSize");

    const smartRemoveFile =
        document.getElementById("smartRemoveFile");

    const smartCheckBtn =
        document.getElementById("smartCheckBtn");

    const smartChecking =
        document.getElementById("smartChecking");

    const smartCheckingText =
        document.getElementById("smartCheckingText");

    const smartResult =
        document.getElementById("smartResult");

    const smartFieldsList =
        document.getElementById("smartFieldsList");

    const smartPercentage =
        document.getElementById(
            "readinessPercentage"
        );

    const readinessCircle =
        document.getElementById(
            "readinessCircle"
        );

    const smartStatusMessage =
        document.getElementById(
            "smartStatusMessage"
        );

    const smartImportantText =
        document.getElementById(
            "smartImportantText"
        );

    const smartCorrectCount =
        document.getElementById(
            "smartCorrectCount"
        );

    const smartMissingCount =
        document.getElementById(
            "smartMissingCount"
        );

    const smartCheckAgain =
        document.getElementById(
            "smartCheckAgain"
        );


    // ==========================================
    // SAFETY CHECK
    // ==========================================

    if (
        !smartFileInput ||
        !smartUploadBtn ||
        !smartCheckBtn
    ) {
        return;
    }


    // ==========================================
    // CURRENT FILE
    // ==========================================

    let selectedSmartFile = null;


    // ==========================================
    // UPLOAD BUTTON
    // ==========================================

    smartUploadBtn.addEventListener(
        "click",
        function () {

            smartFileInput.click();

        }
    );


    // ==========================================
    // FILE SELECTED
    // ==========================================

    smartFileInput.addEventListener(
        "change",
        function () {

            const file =
                smartFileInput.files[0];

            if (!file) {
                return;
            }

            selectedSmartFile = file;


            // File name

            smartFileName.textContent =
                file.name;


            // File size

            smartFileSize.textContent =
                formatFileSize(
                    file.size
                );


            // Show selected file

            smartFilePreview.style.display =
                "flex";


            // Enable check button

            smartCheckBtn.disabled =
                false;


            // Hide previous result

            smartResult.style.display =
                "none";


            smartChecking.style.display =
                "none";


            // Scroll

            smartFilePreview.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }
    );


    // ==========================================
    // FILE SIZE
    // ==========================================

    function formatFileSize(bytes) {

        if (bytes < 1024) {

            return bytes + " B";

        }

        if (bytes < 1024 * 1024) {

            return (
                (bytes / 1024)
                    .toFixed(1)
                + " KB"
            );

        }

        return (
            (bytes / (1024 * 1024))
                .toFixed(1)
            + " MB"
        );

    }


    // ==========================================
    // REMOVE FILE
    // ==========================================

    if (smartRemoveFile) {

        smartRemoveFile.addEventListener(
            "click",
            function () {

                selectedSmartFile = null;

                smartFileInput.value = "";

                smartFilePreview.style.display =
                    "none";

                smartCheckBtn.disabled =
                    true;

                smartChecking.style.display =
                    "none";

                smartResult.style.display =
                    "none";

            }
        );

    }


    // ==========================================
    // CHECK FORM
    // ==========================================

    smartCheckBtn.addEventListener(
        "click",
        async function () {

            if (!selectedSmartFile) {

                alert(
                    "Please upload your form first."
                );

                return;

            }


            // Hide result

            smartResult.style.display =
                "none";


            // Disable button

            smartCheckBtn.disabled =
                true;


            // Show checking

            smartChecking.style.display =
                "block";


            // Scroll

            smartChecking.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });


            // Checking animation text

            await checkingStep(
                "📄 Reading your form...",
                900
            );

            await checkingStep(
                "🔍 Detecting form fields...",
                900
            );

            await checkingStep(
                "🤖 Checking missing information...",
                900
            );


            try {

                // ==================================
                // SEND TO EXISTING OCR BACKEND
                // ==================================

                const formData =
                    new FormData();


                formData.append(
                    "file",
                    selectedSmartFile
                );


                const response =
                    await fetch(
                        "https://formhelp-ai.onrender.com/upload",
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Smart Form OCR:",
                    data
                );


                if (
                    !response.ok ||
                    data.status !== "success"
                ) {

                    throw new Error(
                        data.message ||
                        "Unable to analyze the form."
                    );

                }


                // ==================================
                // GET OCR TEXT
                // ==================================

                const extractedText =
                    data.text || "";


                if (!extractedText.trim()) {

                    throw new Error(
                        "No text could be detected from this form."
                    );

                }


                // ==================================
                // ANALYZE FORM
                // ==================================

                const analysis =
                    analyzeSmartForm(
                        extractedText
                    );


                // ==================================
                // SHOW RESULT
                // ==================================

                displaySmartResult(
                    analysis
                );


            }

            catch (error) {

                console.error(
                    "Smart Form Check Error:",
                    error
                );


                smartChecking.style.display =
                    "none";


                smartCheckBtn.disabled =
                    false;


                alert(
                    "FormHelp AI Error:\n\n" +
                    error.message
                );

            }

        }
    );


    // ==========================================
    // CHECKING STEP
    // ==========================================

    function checkingStep(
        message,
        duration
    ) {

        return new Promise(
            function (resolve) {

                smartCheckingText.textContent =
                    message;

                setTimeout(
                    resolve,
                    duration
                );

            }
        );

    }


    // ==========================================
    // SMART FIELD RULES
    // ==========================================

    const smartFieldRules = [

        {
            name: "Full Name",
            keywords: [
                "full name",
                "name of applicant",
                "applicant name"
            ],
            icon: "👤"
        },

        {
            name: "Father's / Guardian Name",
            keywords: [
                "father",
                "guardian"
            ],
            icon: "👨"
        },

        {
            name: "Mother's Name",
            keywords: [
                "mother"
            ],
            icon: "👩"
        },

        {
            name: "Date of Birth",
            keywords: [
                "date of birth",
                "dob"
            ],
            icon: "🎂"
        },

        {
            name: "Gender",
            keywords: [
                "gender",
                "sex"
            ],
            icon: "⚧️"
        },

        {
            name: "Aadhaar Number",
            keywords: [
                "aadhaar",
                "aadhar"
            ],
            icon: "🪪"
        },

        {
            name: "Mobile Number",
            keywords: [
                "mobile number",
                "mobile no",
                "phone number"
            ],
            icon: "📱"
        },

        {
            name: "Email",
            keywords: [
                "email",
                "email id"
            ],
            icon: "📧"
        },

        {
            name: "Address",
            keywords: [
                "address",
                "permanent address",
                "residential address"
            ],
            icon: "🏠"
        },

        {
            name: "District",
            keywords: [
                "district"
            ],
            icon: "📍"
        },

        {
            name: "State",
            keywords: [
                "state"
            ],
            icon: "🗺️"
        },

        {
            name: "PIN Code",
            keywords: [
                "pin code",
                "pincode",
                "postal code"
            ],
            icon: "📮"
        },

        {
            name: "College / Institution",
            keywords: [
                "college",
                "institution",
                "school"
            ],
            icon: "🏫"
        },

        {
            name: "Course",
            keywords: [
                "course",
                "course name",
                "program"
            ],
            icon: "🎓"
        },

        {
            name: "Year of Study",
            keywords: [
                "year of study",
                "course year",
                "academic year"
            ],
            icon: "📚"
        },

        {
            name: "Category",
            keywords: [
                "category"
            ],
            icon: "📋"
        },

        {
            name: "Annual Family Income",
            keywords: [
                "annual family income",
                "family income",
                "annual income"
            ],
            icon: "💰"
        },

        {
            name: "Bank Account Number",
            keywords: [
                "bank account",
                "account number"
            ],
            icon: "🏦"
        },

        {
            name: "IFSC Code",
            keywords: [
                "ifsc"
            ],
            icon: "🏦"
        },

        {
            name: "Signature",
            keywords: [
                "signature",
                "sign"
            ],
            icon: "✍️"
        }

    ];


    // ==========================================
    // ANALYZE FORM
    // ==========================================

    function analyzeSmartForm(text) {

        const normalizedText =
            text
                .toLowerCase()
                .replace(/\s+/g, " ")
                .trim();


        const fields = [];


        smartFieldRules.forEach(
            function (rule) {

                const found =
                    rule.keywords.some(
                        function (keyword) {

                            return normalizedText
                                .includes(
                                    keyword.toLowerCase()
                                );

                        }
                    );


                if (!found) {
                    return;
                }


                // Try to determine whether
                // the field appears to have
                // some value after it.

                const filled =
                    detectFieldValue(
                        normalizedText,
                        rule.keywords
                    );


                fields.push({

                    name: rule.name,

                    icon: rule.icon,

                    filled: filled

                });

            }
        );


        // ==================================
        // If no known fields found
        // ==================================

        if (fields.length === 0) {

            return {

                fields: [],

                correct: 0,

                missing: 0,

                percentage: 0

            };

        }


        const correct =
            fields.filter(
                field => field.filled
            ).length;


        const missing =
            fields.length -
            correct;


        const percentage =
            Math.round(
                (correct / fields.length) *
                100
            );


        return {

            fields: fields,

            correct: correct,

            missing: missing,

            percentage: percentage

        };

    }


    // ==========================================
    // DETECT FIELD VALUE
    // ==========================================

    function detectFieldValue(
        text,
        keywords
    ) {

        for (
            let i = 0;
            i < keywords.length;
            i++
        ) {

            const keyword =
                keywords[i]
                    .toLowerCase();


            const index =
                text.indexOf(keyword);


            if (index === -1) {
                continue;
            }


            const after =
                text.substring(
                    index +
                    keyword.length
                );


            /*
             * Look at the text immediately
             * after the field name.
             */

            const sample =
                after
                    .substring(0, 80)
                    .trim();


            if (!sample) {
                continue;
            }


            /*
             * Common empty-form patterns:
             *
             * Name:
             * Name -
             * Name ______
             * Name ........
             */

            const cleaned =
                sample
                    .replace(
                        /^[:\-–—]+/,
                        ""
                    )
                    .trim();


            if (!cleaned) {
                continue;
            }


            if (
                /^[_\.\-]+/.test(
                    cleaned
                )
            ) {

                continue;

            }


            /*
             * Avoid treating another
             * field label as a value.
             */

            const nextField =
                smartFieldRules.some(
                    function (otherRule) {

                        if (
                            otherRule.keywords
                                .includes(keyword)
                        ) {
                            return false;
                        }

                        return otherRule.keywords
                            .some(
                                k =>
                                    cleaned
                                        .startsWith(
                                            k.toLowerCase()
                                        )
                            );

                    }
                );


            if (nextField) {
                continue;
            }


            return true;

        }


        return false;

    }


    // ==========================================
    // DISPLAY RESULT
    // ==========================================

    function displaySmartResult(
        analysis
    ) {

        smartChecking.style.display =
            "none";


        smartResult.style.display =
            "block";


        smartCorrectCount.textContent =
            analysis.correct;


        smartMissingCount.textContent =
            analysis.missing;


        smartFieldsList.innerHTML =
            "";


        // ==================================
        // NO FIELDS
        // ==================================

        if (analysis.fields.length === 0) {

            smartFieldsList.innerHTML = `

                <div class="smart-field warning">

                    <div class="field-name">

                        <span class="field-icon">
                            ⚠️
                        </span>

                        No recognizable fields found

                    </div>

                    <span class="field-status">
                        Please upload a clearer form.
                    </span>

                </div>

            `;

        }


        // ==================================
        // FIELD RESULTS
        // ==================================

        analysis.fields.forEach(
            function (field, index) {

                const fieldElement =
                    document.createElement(
                        "div"
                    );


                fieldElement.className =
                    "smart-field " +
                    (
                        field.filled
                            ? "success"
                            : "warning"
                    );


                fieldElement.style.animationDelay =
                    (index * 0.08) + "s";


                fieldElement.innerHTML = `

                    <div class="field-name">

                        <span class="field-icon">
                            ${field.icon}
                        </span>

                        <span>
                            ${escapeSmartHTML(
                                field.name
                            )}
                        </span>

                    </div>


                    <span class="field-status">

                        ${
                            field.filled
                                ? "✅ Looks filled"
                                : "⚠️ Missing / Check"
                        }

                    </span>

                `;


                smartFieldsList.appendChild(
                    fieldElement
                );

            }
        );


        // ==================================
        // PERCENTAGE
        // ==================================

        animatePercentage(
            analysis.percentage
        );


        // ==================================
        // STATUS
        // ==================================

        if (
            analysis.percentage >= 90
        ) {

            smartStatusMessage.textContent =
                "🎉 Your form looks almost complete. Please review it once before submitting.";

            smartImportantText.textContent =
                "Most detected fields appear to be filled. Verify that all information is accurate.";

        }

        else if (
            analysis.percentage >= 60
        ) {

            smartStatusMessage.textContent =
                "👍 Your form is partially complete. A few fields need your attention.";

            smartImportantText.textContent =
                "Please check the fields marked with ⚠️ before submitting the form.";

        }

        else {

            smartStatusMessage.textContent =
                "⚠️ Your form needs attention. Several detected fields may be missing.";

            smartImportantText.textContent =
                "Please complete the missing fields and review the form carefully before submission.";

        }


        // ==================================
        // RE-ENABLE CHECK
        // ==================================

        smartCheckBtn.disabled =
            false;


        // ==================================
        // SCROLL RESULT
        // ==================================

        setTimeout(
            function () {

                smartResult.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            },
            300
        );

    }


    // ==========================================
    // ANIMATE PERCENTAGE
    // ==========================================

    function animatePercentage(
        target
    ) {

        let current = 0;


        const interval =
            setInterval(
                function () {

                    current += 2;


                    if (
                        current >= target
                    ) {

                        current =
                            target;

                        clearInterval(
                            interval
                        );

                    }


                    smartPercentage.textContent =
                        current + "%";


                    const degrees =
                        Math.round(
                            (current / 100) *
                            360
                        );


                    readinessCircle.style
                        .setProperty(
                            "--progress",
                            degrees + "deg"
                        );

                },
                20
            );

    }


    // ==========================================
    // CHECK ANOTHER FORM
    // ==========================================

    if (smartCheckAgain) {

        smartCheckAgain.addEventListener(
            "click",
            function () {

                selectedSmartFile = null;

                smartFileInput.value = "";

                smartFilePreview.style.display =
                    "none";

                smartResult.style.display =
                    "none";

                smartChecking.style.display =
                    "none";

                smartCheckBtn.disabled =
                    true;


                smartPercentage.textContent =
                    "0%";


                readinessCircle.style
                    .setProperty(
                        "--progress",
                        "0deg"
                    );


                smartUploadArea.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }
        );

    }


    // ==========================================
    // ESCAPE HTML
    // ==========================================

    function escapeSmartHTML(value) {

        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }

});
/* =====================================================
   FORMHELP AI - ASK AI
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const openAskAI = document.getElementById("openAskAI");
    const closeAskAI = document.getElementById("closeAskAI");
    const askAIModal = document.getElementById("askAIModal");

    const askAIInput = document.getElementById("askAIInput");
    const askAISend = document.getElementById("askAISend");
    const askAIMessages = document.getElementById("askAIMessages");


    /* =================================================
       OPEN ASK AI
    ================================================= */

    if (openAskAI) {

        openAskAI.addEventListener("click", function () {

            askAIModal.classList.add("active");

            setTimeout(function () {
                if (askAIInput) {
                    askAIInput.focus();
                }
            }, 100);

        });

    }


    /* =================================================
       CLOSE ASK AI
    ================================================= */

    if (closeAskAI) {

        closeAskAI.addEventListener("click", function () {

            askAIModal.classList.remove("active");

        });

    }


    /* =================================================
       CLOSE WHEN CLICKING OUTSIDE
    ================================================= */

    if (askAIModal) {

        askAIModal.addEventListener("click", function (event) {

            if (event.target === askAIModal) {

                askAIModal.classList.remove("active");

            }

        });

    }


    /* =================================================
       SEND MESSAGE
    ================================================= */

    async function sendAskAIMessage() {

        if (!askAIInput || !askAIMessages) {
            return;
        }

        const question = askAIInput.value.trim();

        if (!question) {
            return;
        }


        /* USER MESSAGE */

        const userMessage = document.createElement("div");

        userMessage.className = "user-message";

        userMessage.textContent = question;

        askAIMessages.appendChild(userMessage);


        /* CLEAR INPUT */

        askAIInput.value = "";

        askAIInput.focus();


        /* SCROLL */

        askAIMessages.scrollTop = askAIMessages.scrollHeight;


        /* DISABLE SEND */

        if (askAISend) {
            askAISend.disabled = true;
        }


        /* TYPING INDICATOR */

        const typingMessage = document.createElement("div");

        typingMessage.className = "ai-typing";

        typingMessage.innerHTML =
            'Thinking <span></span><span></span><span></span>';

        askAIMessages.appendChild(typingMessage);

        askAIMessages.scrollTop = askAIMessages.scrollHeight;


        try {

            /* =========================================
               SEND QUESTION TO FLASK BACKEND
            ========================================= */

            const response = await fetch("https://formhelp-ai.onrender.com/ask-ai", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    question: question,

                    language:
                        typeof currentLanguage !== "undefined"
                            ? currentLanguage
                            : "en"

                })

            });


            const data = await response.json();


            /* REMOVE TYPING */

            typingMessage.remove();


            /* =========================================
               AI RESPONSE
            ========================================= */

            const aiMessage = document.createElement("div");

            aiMessage.className = "ai-message";


            if (response.ok && data.answer) {

                aiMessage.textContent = data.answer;

            } else {

                aiMessage.textContent =
                    data.error ||
                    "Sorry, I could not understand your question.";

            }


            askAIMessages.appendChild(aiMessage);

            askAIMessages.scrollTop =
                askAIMessages.scrollHeight;


        } catch (error) {

            console.error("Ask AI Error:", error);


            /* REMOVE TYPING */

            typingMessage.remove();


            const errorMessage =
                document.createElement("div");

            errorMessage.className = "ai-message";

            errorMessage.textContent =
                "⚠️ Unable to connect to FormHelp AI. Please try again.";


            askAIMessages.appendChild(errorMessage);

            askAIMessages.scrollTop =
                askAIMessages.scrollHeight;

        }


        /* ENABLE SEND */

        if (askAISend) {
            askAISend.disabled = false;
        }

    }


    /* =================================================
       SEND BUTTON CLICK
    ================================================= */

    if (askAISend) {

        askAISend.addEventListener(
            "click",
            sendAskAIMessage
        );

    }


    /* =================================================
       ENTER KEY
    ================================================= */

    if (askAIInput) {

        askAIInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    sendAskAIMessage();

                }

            }
        );

    }

});
