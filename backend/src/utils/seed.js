const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios');
const User = require('../models/User');
const Folder = require('../models/Folder');
const Subject = require('../models/Subject');
const Note = require('../models/Note');
const Flashcard = require('../models/Flashcard');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const StudyLog = require('../models/StudyLog');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai-notes-organizer';
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

const getEmbedding = async (text) => {
  try {
    const { data } = await axios.post(`${PYTHON_SERVICE_URL}/embed`, { text });
    return data.embedding;
  } catch (err) {
    console.warn('Could not contact Python service for embedding, using mock vector:', err.message);
    return Array.from({ length: 384 }, () => Math.random() - 0.5);
  }
};

const runSeeder = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clean current databases
    await User.deleteMany({ email: 'student@example.com' });
    console.log('Cleaned existing student@example.com user data.');

    // 1. Create default user
    const user = await User.create({
      name: 'Alex Student',
      email: 'student@example.com',
      password: 'password123',
      currentSemester: 'Semester 5',
    });
    console.log('Created User: Alex Student (student@example.com / password123)');

    // 2. Create semesters (Folders)
    const folderSem4 = await Folder.create({ user: user._id, name: 'Semester 4', order: 4 });
    const folderSem5 = await Folder.create({ user: user._id, name: 'Semester 5', order: 5 });
    console.log('Created semester folders.');

    // 3. Create subjects
    const subCN = await Subject.create({
      user: user._id,
      folder: folderSem5._id,
      name: 'Computer Networks',
      color: '#3b82f6', // blue
    });

    const subDBMS = await Subject.create({
      user: user._id,
      folder: folderSem5._id,
      name: 'Database Management Systems',
      color: '#10b981', // emerald
    });

    const subOS = await Subject.create({
      user: user._id,
      folder: folderSem4._id,
      name: 'Operating Systems',
      color: '#f59e0b', // amber
    });
    console.log('Created subjects: CN, DBMS, OS');

    // 4. Create Notes with text & embeddings
    const noteCNText = `Computer Networks is a system of interconnected computers that share resources and data. The OSI model (Open Systems Interconnection) is a conceptual framework that standardizes network communication. It consists of seven layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application. The Transport Layer utilizes protocols like TCP (Transmission Control Protocol) and UDP (User Datagram Protocol) to manage end-to-end data delivery. TCP provides reliable, ordered, and error-checked delivery of a stream of octets, whereas UDP provides a simpler, connectionless communication model. IP addresses route packets across the internet. Router interfaces use Routing Protocols like OSPF or BGP to discover optimal paths.`;
    const cnEmbedding = await getEmbedding(noteCNText);

    const noteCN = await Note.create({
      user: user._id,
      subject: subCN._id,
      title: 'Introduction to OSI Layers and TCP',
      originalFileName: 'osi_layers_intro.txt',
      fileUrl: 'uploads/osi_layers_intro.txt',
      fileType: 'txt',
      rawText: noteCNText,
      cleanedText: noteCNText,
      summaryShort: 'An overview of Computer Networks standardizing communication through the 7-layer OSI model and transport protocols TCP and UDP.',
      summaryMedium: 'This note explains Computer Networks fundamentals, emphasizing the seven layers of the OSI model: Physical, Data Link, Network, Transport, Session, Presentation, and Application. It distinguishes TCP (connection-oriented, reliable) from UDP (connectionless, fast) at the Transport Layer, and mentions IP addresses and Routing Protocols.',
      summaryDetailed: 'Computer Networks facilitate resource sharing. The 7-layer OSI model provides standard modularity. At the Transport Layer, TCP ensures reliable byte-stream transmission with congestion control, while UDP offers fast, low-overhead Datagram service. Routing devices use dynamic protocols like OSPF and BGP to determine network topology paths.',
      keywords: ['OSI model', 'TCP', 'UDP', 'Transport Layer', 'Routing Protocols'],
      embedding: cnEmbedding,
      processingStatus: 'completed',
      viewCount: 15,
      lastViewedAt: new Date(Date.now() - 3600000),
    });

    const noteDBMSText = `Database Management Systems (DBMS) control data storage, retrieval, and updates. Relational database management systems (RDBMS) structure data into tables with columns and rows. SQL (Structured Query Language) is used to query databases. Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity. Primary keys uniquely identify records in a table, while Foreign keys establish relationships between tables. ACID properties (Atomicity, Consistency, Isolation, Durability) guarantee that database transactions are processed reliably, avoiding database corruption.`;
    const dbmsEmbedding = await getEmbedding(noteDBMSText);

    const noteDBMS = await Note.create({
      user: user._id,
      subject: subDBMS._id,
      title: 'Relational Databases and SQL Heuristics',
      originalFileName: 'rdbms_sql.txt',
      fileUrl: 'uploads/rdbms_sql.txt',
      fileType: 'txt',
      rawText: noteDBMSText,
      cleanedText: noteDBMSText,
      summaryShort: 'Overview of RDBMS, SQL query structures, Normalization, Primary/Foreign keys, and ACID transaction rules.',
      summaryMedium: 'This DBMS summary outlines the relational model where tables hold structured data. It discusses Normalization to prevent redundancy, primary and foreign keys for relational consistency, and the critical ACID properties (Atomicity, Consistency, Isolation, Durability) that guarantee transactional integrity.',
      summaryDetailed: 'Relational Database Management Systems use relational algebra. Normalization reduces anomalies through Normal Forms (1NF, 2NF, 3NF, BCNF). Transactions rely on ACID properties: Atomicity guarantees all-or-nothing, Consistency keeps schemas valid, Isolation prevents parallel conflicts, and Durability ensures permanent writes.',
      keywords: ['RDBMS', 'SQL', 'Normalization', 'ACID properties', 'Primary keys'],
      embedding: dbmsEmbedding,
      processingStatus: 'completed',
      viewCount: 8,
      lastViewedAt: new Date(Date.now() - 7200000),
    });
    console.log('Created Notes with text and embeddings.');

    // 5. Create Flashcards
    await Flashcard.create([
      {
        user: user._id,
        note: noteCN._id,
        front: 'What is the OSI model?',
        back: 'The OSI model (Open Systems Interconnection) is a conceptual framework that standardizes network communication with seven layers.',
        timesReviewed: 5,
        timesCorrect: 4,
      },
      {
        user: user._id,
        note: noteCN._id,
        front: 'Difference between TCP and UDP',
        back: 'TCP is reliable and connection-oriented, whereas UDP is simple, connectionless, and has lower overhead.',
        timesReviewed: 3,
        timesCorrect: 3,
      },
      {
        user: user._id,
        note: noteDBMS._id,
        front: 'What are ACID properties?',
        back: 'ACID properties stand for Atomicity, Consistency, Isolation, and Durability, guaranteeing reliable database transactions.',
        timesReviewed: 4,
        timesCorrect: 2,
      },
    ]);
    console.log('Created Flashcards.');

    // 6. Create Quizzes
    const quizCN = await Quiz.create({
      user: user._id,
      note: noteCN._id,
      title: 'Quiz: Introduction to OSI Layers and TCP',
      questions: [
        {
          type: 'mcq',
          question: 'Which OSI layer manages TCP and UDP protocols?',
          options: ['Network Layer', 'Transport Layer', 'Application Layer', 'Data Link Layer'],
          correctAnswer: 'Transport Layer',
        },
        {
          type: 'true_false',
          question: 'UDP guarantees reliable, ordered packet delivery.',
          options: ['True', 'False'],
          correctAnswer: 'False',
        },
        {
          type: 'fill_blank',
          question: 'The _____ layer is the physical and electrical standard layer in the OSI model.',
          options: [],
          correctAnswer: 'Physical',
        },
      ],
    });

    const quizDBMS = await Quiz.create({
      user: user._id,
      note: noteDBMS._id,
      title: 'Quiz: Relational Databases and SQL',
      questions: [
        {
          type: 'mcq',
          question: 'What does ACID stand for in database systems?',
          options: [
            'Atomicity, Consistency, Isolation, Durability',
            'Automatic, Concurrent, Isolated, Dynamic',
            'All, Clear, Interactive, Documented',
            'Access, Control, Index, Database',
          ],
          correctAnswer: 'Atomicity, Consistency, Isolation, Durability',
        },
        {
          type: 'true_false',
          question: 'Normalization is performed to increase redundancy in tables.',
          options: ['True', 'False'],
          correctAnswer: 'False',
        },
      ],
    });
    console.log('Created Quizzes.');

    // 7. Create Quiz Attempts
    await QuizAttempt.create([
      {
        user: user._id,
        quiz: quizCN._id,
        score: 66,
        totalQuestions: 3,
        correctAnswers: 2,
        answers: [
          { question: quizCN.questions[0]._id, selectedAnswer: 'Transport Layer', isCorrect: true },
          { question: quizCN.questions[1]._id, selectedAnswer: 'True', isCorrect: false },
          { question: quizCN.questions[2]._id, selectedAnswer: 'Physical', isCorrect: true },
        ],
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
      },
      {
        user: user._id,
        quiz: quizDBMS._id,
        score: 50,
        totalQuestions: 2,
        correctAnswers: 1,
        answers: [
          { question: quizDBMS.questions[0]._id, selectedAnswer: 'Atomicity, Consistency, Isolation, Durability', isCorrect: true },
          { question: quizDBMS.questions[1]._id, selectedAnswer: 'True', isCorrect: false },
        ],
        createdAt: new Date(Date.now() - 43200000), // 12 hours ago
      },
    ]);
    console.log('Created Quiz Attempts.');

    // 8. Create Study Logs for Analytics
    await StudyLog.create([
      { user: user._id, subject: subCN._id, note: noteCN._id, activityType: 'note_view', durationSeconds: 600 },
      { user: user._id, subject: subCN._id, note: noteCN._id, activityType: 'flashcard_review', durationSeconds: 300 },
      { user: user._id, subject: subCN._id, note: noteCN._id, activityType: 'quiz_attempt', durationSeconds: 240 },
      { user: user._id, subject: subDBMS._id, note: noteDBMS._id, activityType: 'note_view', durationSeconds: 850 },
      { user: user._id, subject: subDBMS._id, note: noteDBMS._id, activityType: 'quiz_attempt', durationSeconds: 180 },
      { user: user._id, subject: subOS._id, activityType: 'note_view', durationSeconds: 400 },
    ]);
    console.log('Created Study Logs.');

    console.log('Database Seeding Successful! You can log in with:');
    console.log('Email: student@example.com');
    console.log('Password: password123');

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

runSeeder();
