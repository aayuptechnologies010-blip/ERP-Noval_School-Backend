const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const ProfessionalTaxSlab = require('./models/professionalTaxSlabModel');
const Staff = require('./models/staffModel');
const StaffDocumentType = require('./models/staffdocumenttypeModel');

async function seedTaxAndDocs() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/erp_school';
    console.log('Connecting to MongoDB at:', mongoUri);
    await mongoose.connect(mongoUri);

    console.log('=== SEEDING PROFESSIONAL TAX SLABS ===');
    // Clear existing Ayup Tech slabs to avoid duplication
    await ProfessionalTaxSlab.deleteMany({
      groupName: { $in: ['Ayup Tech Professional Tax Group', 'Maharashtra Standard P-Tax'] }
    });

    const taxSlabs = [
      {
        groupName: 'Ayup Tech Professional Tax Group',
        groupSlNo: 1,
        lowerBound: 0,
        upperBound: 7500,
        tax: 0,
        applicableMonth: 'All',
        gender: 'All',
        status: 'Active',
        remarks: 'Ayup Tech standard zero tax bracket for gross up to 7,500'
      },
      {
        groupName: 'Ayup Tech Professional Tax Group',
        groupSlNo: 2,
        lowerBound: 7501,
        upperBound: 10000,
        tax: 175,
        applicableMonth: 'All',
        gender: 'All',
        status: 'Active',
        remarks: 'Ayup Tech intermediate tax bracket for gross 7,501 to 10,000'
      },
      {
        groupName: 'Ayup Tech Professional Tax Group',
        groupSlNo: 3,
        lowerBound: 10001,
        upperBound: 1000000,
        tax: 200,
        applicableMonth: 'All',
        gender: 'All',
        status: 'Active',
        remarks: 'Ayup Tech higher tax bracket for gross above 10,000 (standard ₹200/mo)'
      },
      {
        groupName: 'Maharashtra Standard P-Tax',
        groupSlNo: 1,
        lowerBound: 0,
        upperBound: 7500,
        tax: 0,
        applicableMonth: 'All',
        gender: 'All',
        status: 'Active',
        remarks: 'Nil tax bracket'
      },
      {
        groupName: 'Maharashtra Standard P-Tax',
        groupSlNo: 2,
        lowerBound: 7501,
        upperBound: 10000,
        tax: 175,
        applicableMonth: 'All',
        gender: 'All',
        status: 'Active',
        remarks: 'Tax bracket for ₹7,501 - ₹10,000'
      },
      {
        groupName: 'Maharashtra Standard P-Tax',
        groupSlNo: 3,
        lowerBound: 10001,
        upperBound: 1000000,
        tax: 200,
        applicableMonth: 'All',
        gender: 'All',
        status: 'Active',
        remarks: 'Standard ₹200/mo bracket'
      }
    ];

    const insertedSlabs = await ProfessionalTaxSlab.insertMany(taxSlabs);
    console.log(`✅ Inserted ${insertedSlabs.length} Professional Tax Slabs!`);

    console.log('\n=== ENSURING STAFF DOCUMENT TYPES ===');
    const defaultDocTypes = [
      'Aadhaar Card',
      'PAN Card',
      'Educational Certificate',
      'Experience Certificate',
      'Appointment Letter',
      'Bank Passbook / Cancelled Cheque',
      'Police Clearance Certificate'
    ];

    for (const dt of defaultDocTypes) {
      const exists = await StaffDocumentType.findOne({ type: dt });
      if (!exists) {
        await StaffDocumentType.create({ type: dt });
        console.log(`  + Created doc type: ${dt}`);
      }
    }

    console.log('\n=== SEEDING DOCUMENTS FOR AYUP TECH ===');
    const ayupStaff = await Staff.findOne({
      $or: [
        { userName: 'SF072' },
        { firstName: { $regex: 'ayup', $options: 'i' } },
        { lastName: { $regex: 'tech', $options: 'i' } }
      ]
    });

    if (ayupStaff) {
      console.log(`Found Ayup Tech staff: ${ayupStaff.firstName} ${ayupStaff.lastName} (${ayupStaff.userName}) [${ayupStaff._id}]`);
      
      // Update/seed documents array
      ayupStaff.documents = [
        {
          documentType: 'Aadhaar Card',
          documentName: 'Ayup Tech Government Aadhaar Card',
          documentUrl: '/uploads/sample_ayup_aadhaar.png',
          fileName: 'ayup_tech_aadhaar.png',
          fileSize: 245760,
          mimeType: 'image/png',
          uploadDate: new Date('2026-08-15'),
          isVerified: true,
          verifiedAt: new Date('2026-08-16'),
          verifiedBy: 'Admin',
          remarks: 'Verified against national identity database'
        },
        {
          documentType: 'Educational Certificate',
          documentName: 'Ayup Tech MCA Degree Certificate',
          documentUrl: '/uploads/sample_ayup_degree.pdf',
          fileName: 'ayup_tech_mca_degree.pdf',
          fileSize: 1048576,
          mimeType: 'application/pdf',
          uploadDate: new Date('2026-08-20'),
          isVerified: true,
          verifiedAt: new Date('2026-08-21'),
          verifiedBy: 'HR Department',
          remarks: 'First class with distinction degree verified'
        },
        {
          documentType: 'Experience Certificate',
          documentName: 'Ayup Tech Previous Experience Certificate',
          documentUrl: '/uploads/sample_ayup_exp.pdf',
          fileName: 'ayup_tech_exp_cert.pdf',
          fileSize: 524288,
          mimeType: 'application/pdf',
          uploadDate: new Date('2026-09-01'),
          isVerified: false,
          verifiedAt: null,
          verifiedBy: '',
          remarks: 'Pending verification from previous employer'
        }
      ];

      await ayupStaff.save();
      console.log(`✅ Seeded ${ayupStaff.documents.length} verified/pending documents for Ayup Tech!`);
    } else {
      console.log('⚠️ Could not find Ayup Tech staff record to attach documents.');
    }

    console.log('\n🎉 ALL TAX SLABS & STAFF DOCUMENTS SEEDED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seedTaxAndDocs();
