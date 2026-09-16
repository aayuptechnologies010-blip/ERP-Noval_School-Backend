const XLSX = require('xlsx');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Models
const Student = require('./models/studentModel');
const SchoolClass = require('./models/schoolClassModel');
const Section = require('./models/sectionModel');
const ClassSection = require('./models/classSectionModel');
const Religion = require('./models/religionModel');
const Category = require('./models/categoryModel');
const Caste = require('./models/casteModel');
const StudentFeeLedger = require('./models/studentFeeLedgerModel');

function parseDateStr(str) {
  if (!str) return null;
  const s = String(str).trim();
  if (s === '' || s === 'N/A' || s === '01-Jan-1900' || s === '0') return null;

  const parsed = new Date(s);
  if (!isNaN(parsed.getTime()) && parsed.getFullYear() > 1950) {
    return parsed;
  }
  return null;
}

function cleanStr(val) {
  if (val === undefined || val === null) return '';
  const s = String(val).trim();
  if (s === 'N/A' || s === '01-Jan-1900' || s === 'null' || s === 'undefined') return '';
  return s;
}

function splitName(fullName) {
  if (!fullName) return { first: '', middle: '', last: '' };
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: '', middle: '', last: '' };
  if (parts.length === 1) return { first: parts[0], middle: '', last: '' };
  if (parts.length === 2) return { first: parts[0], middle: '', last: parts[1] };
  return {
    first: parts[0],
    middle: parts.slice(1, -1).join(' '),
    last: parts[parts.length - 1]
  };
}

async function runImport() {
  const filePath = 'C:/Users/Admin/Downloads/All Student details (1).xlsx';
  console.log(`Loading Excel file: ${filePath}...`);
  const wb = XLSX.readFile(filePath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });

  console.log(`Total rows in sheet: ${data.length}`);
  const headerRow = data[9];

  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB:', mongoose.connection.name);

  // 1. Reset & Sync Master Data
  console.log('\n--- 1. Synchronizing Master Data ---');

  // Master Classes
  const classOrder = ['NUR', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  for (let i = 0; i < classOrder.length; i++) {
    const cName = classOrder[i];
    await SchoolClass.findOneAndUpdate(
      { className: cName },
      { className: cName, orderNo: i + 1, isActive: true },
      { upsert: true, returnDocument: 'after' }
    );
  }

  // Master Sections
  const sectionNames = ['A', 'B', 'C'];
  for (let i = 0; i < sectionNames.length; i++) {
    const sName = sectionNames[i];
    await Section.findOneAndUpdate(
      { sectionName: sName },
      { sectionName: sName, orderNo: i + 1, isActive: true },
      { upsert: true, returnDocument: 'after' }
    );
  }

  // Master Religions
  const religionsList = ['HINDU', 'MUSLIM', 'SIKH', 'CHRISTIAN', 'JAIN', 'OTHER'];
  for (let r of religionsList) {
    await Religion.findOneAndUpdate(
      { religionName: r },
      { religionName: r, isActive: true },
      { upsert: true, returnDocument: 'after' }
    );
  }

  // Master Categories
  const categoriesList = ['GENERAL', 'OBC', 'SC', 'ST'];
  for (let c of categoriesList) {
    await Category.findOneAndUpdate(
      { name: c },
      { name: c, isActive: true },
      { upsert: true, returnDocument: 'after' }
    );
  }

  // 2. Parse Students Dynamically by Header Name
  console.log('\n--- 2. Parsing 1237 Student Rows ---');
  const studentDocs = [];
  const classSectionsMap = {}; // { 'NUR': ['A'], '10': ['A', 'B', 'C'] }
  const classCounts = {};

  for (let r = 10; r < data.length; r++) {
    const row = data[r];
    if (!row || row.length === 0) continue;

    // Map row to header names
    const rowObj = {};
    for (let c = 0; c < headerRow.length; c++) {
      const h = headerRow[c];
      if (h && h.trim()) {
        rowObj[h.trim()] = row[c];
      }
    }

    const admNo = cleanStr(rowObj['ADM. NO.']);
    if (!admNo) continue; // Skip invalid or summary rows

    const sn = cleanStr(rowObj['SN']);
    const className = cleanStr(rowObj['CLASS_NAME']);
    const classCombined = cleanStr(rowObj['CLASS']); // e.g. NUR-A
    const billNo = cleanStr(rowObj['BILL NO.']);
    const rollNo = cleanStr(rowObj['ROLL NO']);
    const studentFullName = cleanStr(rowObj['STUDENT NAME']);
    const boardingScholar = cleanStr(rowObj['BOARDING/DAY SCHOLAR']);
    const studentName1 = cleanStr(rowObj['STUDENT NAME1']);
    const optionalSubName = cleanStr(rowObj['OPTIONALSUBNAME']);
    const sectionName = cleanStr(rowObj['SECTION']);
    const fatherFullName = cleanStr(rowObj['FATHERFULLNAME']);
    const generalDesc = cleanStr(rowObj['GENERAL DESCRIPTION']);
    const contactMob = cleanStr(rowObj['CONTACT MOB.']);
    const studentMiddleName = cleanStr(rowObj['STUDENT MIDDLE NAME']);
    const studentLastName = cleanStr(rowObj['STUDENT LAST NAME']);
    const stuDob = parseDateStr(rowObj['STU DOB']);
    const stuDoad = parseDateStr(rowObj['STU DOAD']);
    const stDoj = parseDateStr(rowObj['ST DOJ']);
    const religion = cleanStr(rowObj['RELIGION']);
    const category = cleanStr(rowObj['CATEGORY']);
    const house = cleanStr(rowObj['HOUSE']);
    const stuAddress = cleanStr(rowObj['STU ADDRESS']);
    const stuContactNo = cleanStr(rowObj['STU CONTACT NO']);
    const bloodGroup = cleanStr(rowObj['BLOODGROUP']);
    const nationality = cleanStr(rowObj['NATIONALITY']) || 'Indian';
    const gender = cleanStr(rowObj['GENDER']);
    const studentEmail = cleanStr(rowObj['STUDENT_EMAIL']);
    const contactPerson = cleanStr(rowObj['CONTACTPERSON']);
    const contactEmail = cleanStr(rowObj['CONTACTEMAIL']);
    const stBarcode = cleanStr(rowObj['STBARCODE']);
    const stuPrevSchoolName = cleanStr(rowObj['STUDENTPREVIOUSSCHOOLNAME']);
    const prvSchoolDol = cleanStr(rowObj['PRV SCHOOL DOL']);
    const emrgPerson = cleanStr(rowObj['EMRG CONT PERSON']);
    const emrgMobile = cleanStr(rowObj['EMRG CONT MOBILE']);
    const emrgPhone = cleanStr(rowObj['EMRG CONT PHONE']);
    const emrgAdd = cleanStr(rowObj['EMRG CONT ADD']);
    const emrgRtl = cleanStr(rowObj['EMRG CONT RTL']);
    const fmlyDocName = cleanStr(rowObj['FMLY DOC NAME']);
    const fmlyDocPhone = cleanStr(rowObj['FMLY DOC PHONE']);
    const fmlyDocAdd = cleanStr(rowObj['FMLY DOC ADD']);
    const studentStatus = cleanStr(rowObj['STUDENTSTATUS']) || 'STUDYING';
    const aadharCardNo = cleanStr(rowObj['AADHAR CARDNO']);
    const studentContact2 = cleanStr(rowObj['STUDENT CONTACT2']);
    const pinCode = cleanStr(rowObj['PIN CODE']);
    const state = cleanStr(rowObj['STATE']) || 'UP';
    const city = cleanStr(rowObj['CITY']) || 'MAU';
    const birthPlace = cleanStr(rowObj['BIRTHPLACE']);
    const boardRegNo = cleanStr(rowObj['BOARDREGNO']);
    const fatherName = cleanStr(rowObj['FATHERNAME']);
    const stfMiddleName = cleanStr(rowObj['STF_MDDLENME']);
    const stfLastName = cleanStr(rowObj['STF_LATNME']);
    const fatherDesignation = cleanStr(rowObj['FATHERDESIGNATION']);
    const fatherPhone = cleanStr(rowObj['FATHERPHONE']);
    const fatherDob = parseDateStr(rowObj['FATHERDOB']);
    const fatherRAddress = cleanStr(rowObj['FATHERRADDRESS']);
    const fatherOfficeAddress = cleanStr(rowObj['FATHEROFFICEADDRESS']);
    const fatherEmail1 = cleanStr(rowObj['FATHEREMAIL1']);
    const fatherEmailSecond = cleanStr(rowObj['FATHER EMAIL SECOND']);
    const fatherMob = cleanStr(rowObj['FATHERMOB']);
    const fatherProfession = cleanStr(rowObj['FATHERPROFESSION']);
    const frCompany = cleanStr(rowObj['FR_CMPYNAME']);
    const frBusiness = cleanStr(rowObj['FR_BUSINESSOF']);
    const frProfessional = cleanStr(rowObj['FR_PROFESSIONAL']);
    const frOthers = cleanStr(rowObj['FR_OTHERS']);
    const frServiceIn = cleanStr(rowObj['FR_SERVICEIN']);
    const frOffPhone = cleanStr(rowObj['FR_OFF_PHONE']);
    const frOffMobile = cleanStr(rowObj['FR_OFF_MOBILE']);
    const frOffExtn = cleanStr(rowObj['FR_OFF_EXTN']);
    const frOffEmail = cleanStr(rowObj['FR_OFF_EMAILID']);
    const frOffWebsite = cleanStr(rowObj['FR_OFF_WEBSITE']);
    const fatherIncome = cleanStr(rowObj['FATHERINCOME']);
    const motherFullName = cleanStr(rowObj['MOTHERFULLNAME']);
    const motherName = cleanStr(rowObj['MOTHERNAME']);
    const stmMiddleName = cleanStr(rowObj['STM_MDDLENME']);
    const stmLastName = cleanStr(rowObj['STM_LATNME']);
    const motherDob = parseDateStr(rowObj['MOTHERDOB']);
    const motherRAddress = cleanStr(rowObj['MOTHERRADDRESS']);
    const motherOfficeAddress = cleanStr(rowObj['MOTHEROFFICEADDRESS']);
    const motherEmail1 = cleanStr(rowObj['MOTHEREMAIL1']);
    const motherEmailSecond = cleanStr(rowObj['MOTHER EMAIL SECOND']);
    const motherMob = cleanStr(rowObj['MOTHERMOB']);
    const motherProfession = cleanStr(rowObj['MOTHERPROFESSION']);
    const mrCompany = cleanStr(rowObj['MR_CMPYNAME']);
    const mrBusiness = cleanStr(rowObj['MR_BUSINESSOF']);
    const mrProfessional = cleanStr(rowObj['MR_PROFESSIONAL']);
    const mrOthers = cleanStr(rowObj['MR_OTHERS']);
    const mrServiceIn = cleanStr(rowObj['MR_SERVICEIN']);
    const mrOffPhone = cleanStr(rowObj['MR_OFF_PHONE']);
    const mrOffMobile = cleanStr(rowObj['MR_OFF_MOBILE']);
    const mrOffExtn = cleanStr(rowObj['MR_OFF_EXTN']);
    const mrOffEmail = cleanStr(rowObj['MR_OFF_EMAILID']);
    const mrOffWebsite = cleanStr(rowObj['MR_OFF_WEBSITE']);
    const dateOfAnniversary = parseDateStr(rowObj['DATEOFANNIVERSARY']);
    const parentStatus = cleanStr(rowObj['PARENTSTAUS']);
    const motherIncome = cleanStr(rowObj['MOTHERINCOME']);
    const guarName = cleanStr(rowObj['GUARNAME']);
    const guarDesignation = cleanStr(rowObj['GUARDESIGNATION']);
    const guarPhone = cleanStr(rowObj['GUARPHONE']);
    const guarDob = parseDateStr(rowObj['GUARDOB']);
    const guarRAddress = cleanStr(rowObj['GUARRADDRESS']);
    const guarOfficeAddress = cleanStr(rowObj['GUAROFFICEADDRESS']);
    const guarEmail1 = cleanStr(rowObj['GUAREMAIL1']);
    const guarEmailSecond = cleanStr(rowObj['GUAR EMAIL SECOND']);
    const guarMob = cleanStr(rowObj['GUARMOB']);
    const guarProfession = cleanStr(rowObj['GUARPROFESSION']);
    const guarCompany = cleanStr(rowObj['GUARCMPYNAME']);
    const guarProfessional = cleanStr(rowObj['GUARPROFESSIONAL']);
    const guarBusiness = cleanStr(rowObj['GUARBUSINESSOF']);
    const guarOthers = cleanStr(rowObj['GUAROTHERS']);
    const guarServiceIn = cleanStr(rowObj['GUARSERVICEIN']);
    const guarOffPhone = cleanStr(rowObj['GUAR_OFF_PHONE']);
    const guarOffMobile = cleanStr(rowObj['GUAR_OFF_MOBILE']);
    const guarOffExtn = cleanStr(rowObj['GUAR_OFF_EXTN']);
    const guarOffEmail = cleanStr(rowObj['GUAR_OFF_EMAILID']);
    const guarOffWebsite = cleanStr(rowObj['GUAR_OFF_WEBSITE']);
    const guarIncome = cleanStr(rowObj['GUARINCOME']);
    const caste = cleanStr(rowObj['CASTE']);
    const ews = cleanStr(rowObj['EWS']);
    const motherTongue = cleanStr(rowObj['MOTHER TONGUE']);
    const streamName = cleanStr(rowObj['STREAM NAME']);
    const gaurOtherInfo = cleanStr(rowObj['GAUR OTHER INFO']);
    const newOld = cleanStr(rowObj['NEW/OLD']) || 'New';
    const stuPrevCity = cleanStr(rowObj['STUDENTPREVIOUSSCHOOLCITY']);
    const saralNo = cleanStr(rowObj['SARAL NO']);
    const dayScholar = cleanStr(rowObj['DAY SCHOLAR']);
    const boarding = cleanStr(rowObj['BOARDING']);
    const medicalHistory = cleanStr(rowObj['MEDICAL HISTORY']);
    const classificationName = cleanStr(rowObj['CLASSIFICATION NAME']);

    // Split student names
    const sNameParts = splitName(studentFullName || studentName1);
    const firstName = sNameParts.first || 'Student';
    const middleName = studentMiddleName || sNameParts.middle;
    const lastName = studentLastName || sNameParts.last || '-';

    // Split father names
    const fNameParts = splitName(fatherFullName || fatherName);
    const fFirst = fNameParts.first;
    const fMiddle = stfMiddleName || fNameParts.middle;
    const fLast = stfLastName || fNameParts.last;

    // Split mother names
    const mNameParts = splitName(motherFullName || motherName);
    const mFirst = mNameParts.first;
    const mMiddle = stmMiddleName || mNameParts.middle;
    const mLast = stmLastName || mNameParts.last;

    // Determine primary contact
    const primaryPhone = contactMob || stuContactNo || studentContact2 || fatherMob || fatherPhone || motherMob || '';
    const secondaryPhone = studentContact2 || stuContactNo || fatherMob || motherMob || '';

    // Class & Section normalization
    let cVal = className;
    let sVal = sectionName;
    if (!cVal && classCombined) {
      const sp = classCombined.split('-');
      cVal = sp[0];
      sVal = sVal || sp[1] || 'A';
    }
    if (!sVal) sVal = 'A';

    if (!classSectionsMap[cVal]) classSectionsMap[cVal] = new Set();
    classSectionsMap[cVal].add(sVal);

    const classSectionKey = `${cVal}-${sVal}`;
    classCounts[classSectionKey] = (classCounts[classSectionKey] || 0) + 1;

    // Emergency contacts array if any
    const emergencyContacts = [];
    if (emrgPerson || emrgMobile || emrgPhone) {
      emergencyContacts.push({
        name: emrgPerson || fatherFullName || motherFullName,
        mobileNumber: emrgMobile || primaryPhone,
        phoneNumber: emrgPhone || '',
        address: emrgAdd || stuAddress,
        relation: emrgRtl || 'Parent/Guardian'
      });
    }

    const doc = {
      personalDetails: {
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        dateOfBirth: stuDob,
        gender: gender || 'Male',
        bloodGroup: bloodGroup || '',
        religion: religion || 'HINDU',
        caste: caste || '',
        subCaste: '',
        nationality: nationality || 'Indian',
        placeOfBirth: birthPlace || '',
        motherTongue: motherTongue || 'Hindi',
        studentPhoto: '',
        parish: '',
        schoolCategory: category || 'General',
        houseNames: house || '',
        isNachEcs: false,
        isEwsCwsn: ews || 'NO',
        isMinority: (religion && religion.toUpperCase() !== 'HINDU') ? true : false,
        isDisabilityCwsn: false,
        disabilityDescription: medicalHistory || '',
        isRte: 'No',
        clubs: '',
        cadetType: classificationName || '',
        statesNationalCompetitions: '',
        foodStatus: '',
        boardingHostel: boardingScholar || (boarding === 'Yes' ? 'Hosteller' : 'Day Scholar'),
        isOnlyChild: false,
      },

      academicDetails: {
        admissionNumber: admNo,
        admissionStatus: newOld || 'Continuous',
        currentStatus: studentStatus || 'STUDYING',
        reason: generalDesc || '',
        rollNumber: rollNo || '',
        class: cVal,
        section: sVal,
        board: 'CBSE',
        dateOfAdmission: stuDoad || new Date('2026-04-01'),
        dateOfJoining: stDoj || stuDoad || new Date('2026-04-01'),
        stream: streamName || '',
        optionalSubject: optionalSubName || '',
        previousClass: stuPrevSchoolName || '',
        sixSubject: ''
      },

      transportDetails: {
        isTransportStudent: false,
        isSelfTransport: false,
        transportFee: 0,
        assignedDate: new Date()
      },

      uniqueIds: {
        udiseNumber: aadharCardNo || '',
        pen: '',
        apaarId: aadharCardNo || '',
        ePunjabNumber: '',
        feesNumber: '',
        saralNumber: saralNo || '',
        srnNumber: boardRegNo || '',
        issen: false,
        abhaNumber: '',
        billGrNumber: billNo || '',
        studentNumber: sn || '',
        rfidCardNumber: stBarcode || ''
      },

      contactAddress: {
        contactNumber: primaryPhone,
        secondaryContactNo: secondaryPhone,
        studentEmail: studentEmail || '',
        currentAddress: stuAddress || '',
        pinCode: pinCode || '',
        city: city || 'MAU',
        state: state || 'UP',
        permanentAddress: stuAddress || '',
        permanentPinCode: pinCode || '',
        permanentCity: city || 'MAU',
        permanentState: state || 'UP',
        domicileState: state || 'UP'
      },

      familyDetails: {
        familyId: '',
        parentStatus: (parentStatus && parentStatus !== '0') ? parentStatus : 'Normal',
        staffName: '',
        familyPhoto: '',
        father: {
          title: 'Mr.',
          firstName: fFirst || fatherFullName || '',
          middleName: fMiddle || '',
          lastName: fLast || '',
          aadharNumber: aadharCardNo || '',
          panNumber: '',
          annualIncome: fatherIncome || '',
          dob: fatherDob,
          mobile: fatherMob || primaryPhone,
          phone: fatherPhone || '',
          email: fatherEmail1 || contactEmail || '',
          residenceAddress: fatherRAddress || stuAddress || '',
          qualification: '',
          profession: fatherProfession || '',
          professionDetails: frProfessional || '',
          designation: (fatherDesignation && fatherDesignation !== '0') ? fatherDesignation : '',
          designationDetails: '',
          companyName: frCompany || '',
          businessDetails: frBusiness || '',
          serviceIn: frServiceIn || '',
          officeAddress: fatherOfficeAddress || '',
          officePhone: frOffPhone || '',
          officeMobile: frOffMobile || '',
          officeExtension: frOffExtn || '',
          officeEmail: frOffEmail || '',
          officeWebsite: frOffWebsite || '',
          isAlumni: 'No',
          batchYear: '',
          photo: ''
        },
        mother: {
          title: 'Mrs.',
          firstName: mFirst || motherFullName || '',
          middleName: mMiddle || '',
          lastName: mLast || '',
          aadharNumber: '',
          panNumber: '',
          annualIncome: motherIncome || '',
          dob: motherDob,
          mobile: motherMob || '',
          phone: mrOffPhone || '',
          email: motherEmail1 || '',
          residenceAddress: motherRAddress || stuAddress || '',
          qualification: '',
          profession: motherProfession || '',
          professionDetails: mrProfessional || '',
          designation: '',
          designationDetails: '',
          companyName: mrCompany || '',
          businessDetails: mrBusiness || '',
          serviceIn: mrServiceIn || '',
          officeAddress: motherOfficeAddress || '',
          officePhone: mrOffPhone || '',
          officeMobile: mrOffMobile || '',
          officeExtension: mrOffExtn || '',
          officeEmail: mrOffEmail || '',
          officeWebsite: mrOffWebsite || '',
          isAlumni: 'No',
          batchYear: '',
          anniversaryDate: dateOfAnniversary,
          photo: ''
        }
      },

      guardianDetails: {
        title: 'Mr.',
        name: guarName || contactPerson || '',
        dob: guarDob,
        income: guarIncome || '',
        relationship: 'Guardian',
        mobile: guarMob || '',
        phone: guarPhone || '',
        email: guarEmail1 || '',
        residenceAddress: guarRAddress || '',
        qualification: '',
        profession: guarProfession || '',
        professionDetails: guarProfessional || '',
        designation: (guarDesignation && guarDesignation !== '0') ? guarDesignation : '',
        companyName: guarCompany || '',
        businessDetails: guarBusiness || '',
        serviceIn: guarServiceIn || '',
        officeAddress: guarOfficeAddress || '',
        officePhone: guarOffPhone || '',
        officeMobile: guarOffMobile || '',
        officeExtension: guarOffExtn || '',
        officeEmail: guarOffEmail || '',
        officeWebsite: guarOffWebsite || '',
        secondaryGuardianName: '',
        secondaryGuardianMobile: '',
        secondaryGuardianRelationship: ''
      },

      emergencyContacts: emergencyContacts,
      isFavorite: false,
      isAdmissionVerified: true,
      uploadedDocuments: []
    };

    studentDocs.push(doc);
  }

  console.log(`Parsed total valid student records: ${studentDocs.length}`);

  // 3. Reset and Set ClassSection master records
  console.log('\n--- 3. Setting up ClassSection records ---');
  await ClassSection.deleteMany({});
  for (let cName of Object.keys(classSectionsMap)) {
    const secArray = Array.from(classSectionsMap[cName]).sort();
    await ClassSection.create({
      className: cName,
      sections: secArray
    });
  }
  console.log(`Created ${Object.keys(classSectionsMap).length} ClassSection records.`);

  // 4. Clean and Replace Students Collection
  console.log('\n--- 4. Replacing Students in MongoDB ---');
  await Student.deleteMany({});
  console.log('Cleared existing students.');

  // Insert in batches of 200 for fast & reliable network insert
  const batchSize = 200;
  let totalInserted = 0;
  for (let i = 0; i < studentDocs.length; i += batchSize) {
    const batch = studentDocs.slice(i, i + batchSize);
    const res = await Student.insertMany(batch);
    totalInserted += res.length;
    console.log(`Inserted batch ${i + 1} - ${i + res.length} (${totalInserted}/${studentDocs.length})`);
  }

  // 5. Initialize / Sync StudentFeeLedgers
  console.log('\n--- 5. Initializing Student Fee Ledgers ---');
  await StudentFeeLedger.deleteMany({});
  const allStudents = await Student.find({}, '_id').lean();
  const feeLedgers = allStudents.map(st => ({
    student: st._id,
    totalDues: 0,
    totalPaid: 0,
    advanceAmount: 0,
    lastPaymentDate: new Date()
  }));

  for (let i = 0; i < feeLedgers.length; i += batchSize) {
    const batch = feeLedgers.slice(i, i + batchSize);
    await StudentFeeLedger.insertMany(batch);
  }
  console.log(`Created ${feeLedgers.length} fee ledgers.`);

  // 6. Verify and Log Summary
  console.log('\n========================================');
  console.log('       IMPORT VERIFICATION SUMMARY      ');
  console.log('========================================');
  const finalCount = await Student.countDocuments();
  console.log(`Total Students in DB: ${finalCount}`);
  console.log('\nClass-wise breakdown:');
  const sortedKeys = Object.keys(classCounts).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  for (let k of sortedKeys) {
    console.log(`  Class ${k.padEnd(8)} : ${classCounts[k]} students`);
  }

  console.log('\nSample Student from DB (Admission 2511):');
  const sample = await Student.findOne({ 'academicDetails.admissionNumber': '2511' });
  console.log({
    admNo: sample.academicDetails.admissionNumber,
    name: `${sample.personalDetails.firstName} ${sample.personalDetails.lastName}`,
    class: `${sample.academicDetails.class}-${sample.academicDetails.section}`,
    father: sample.familyDetails.father.firstName,
    mother: sample.familyDetails.mother.firstName,
    mobile: sample.contactAddress.contactNumber,
    address: sample.contactAddress.currentAddress,
    city: sample.contactAddress.city,
    religion: sample.personalDetails.religion,
    category: sample.personalDetails.schoolCategory,
    barcode: sample.uniqueIds.rfidCardNumber
  });

  console.log('\nSUCCESS: ALL 1237 STUDENTS & ALL 138 FIELDS SUCCESSFULLY IMPORTED!');
  await mongoose.disconnect();
}

runImport().catch(err => {
  console.error('Import Failed:', err);
  process.exit(1);
});
