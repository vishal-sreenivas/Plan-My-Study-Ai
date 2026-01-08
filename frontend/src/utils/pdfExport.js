// PDF export utility
// Generates downloadable PDF from course plan

import jsPDF from 'jspdf';

/**
 * Export course plan as PDF
 * 
 * @param {object} course - Course object with plan data
 */
export const exportCourseToPDF = (course) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace = 20) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
    }
  };

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(course.plan.overview.title || course.topic, pageWidth / 2, yPosition, {
    align: 'center',
  });
  yPosition += 10;

  // Course Info
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Topic: ${course.topic}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Level: ${course.level.charAt(0).toUpperCase() + course.level.slice(1)}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Duration: ${course.days} days × ${course.timePerDay} minutes/day`, 20, yPosition);
  yPosition += 10;

  // Description
  if (course.plan.overview.description) {
    checkPageBreak(15);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Course Description', 20, yPosition);
    yPosition += 6;
    doc.setFont('helvetica', 'normal');
    const descriptionLines = doc.splitTextToSize(course.plan.overview.description, pageWidth - 40);
    doc.text(descriptionLines, 20, yPosition);
    yPosition += descriptionLines.length * 5 + 5;
  }

  // Learning Objectives
  if (course.plan.overview.objectives && course.plan.overview.objectives.length > 0) {
    checkPageBreak(15);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Learning Objectives', 20, yPosition);
    yPosition += 6;
    doc.setFont('helvetica', 'normal');
    course.plan.overview.objectives.forEach((objective) => {
      checkPageBreak(6);
      doc.text(`• ${objective}`, 25, yPosition);
      yPosition += 6;
    });
    yPosition += 5;
  }

  // Modules
  if (course.plan.modules && course.plan.modules.length > 0) {
    checkPageBreak(10);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Course Modules', 20, yPosition);
    yPosition += 6;
    doc.setFont('helvetica', 'normal');
    course.plan.modules.forEach((module) => {
      checkPageBreak(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${module.title}`, 25, yPosition);
      yPosition += 6;
      if (module.description) {
        doc.setFont('helvetica', 'normal');
        const descLines = doc.splitTextToSize(module.description, pageWidth - 50);
        doc.text(descLines, 30, yPosition);
        yPosition += descLines.length * 5;
      }
      yPosition += 3;
    });
    yPosition += 5;
  }

  // Daily Plan
  if (course.plan.dailyPlan && course.plan.dailyPlan.length > 0) {
    checkPageBreak(10);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Daily Study Plan', 20, yPosition);
    yPosition += 6;

    course.plan.dailyPlan.forEach((day) => {
      checkPageBreak(15);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`Day ${day.day}`, 25, yPosition);
      yPosition += 6;

      if (day.lessons && day.lessons.length > 0) {
        doc.setFont('helvetica', 'normal');
        day.lessons.forEach((lesson) => {
          checkPageBreak(8);
          doc.setFont('helvetica', 'bold');
          doc.text(`  ${lesson.title} (${lesson.timeMinutes} min)`, 30, yPosition);
          yPosition += 5;
          if (lesson.description) {
            doc.setFont('helvetica', 'normal');
            const lessonLines = doc.splitTextToSize(lesson.description, pageWidth - 55);
            doc.text(lessonLines, 35, yPosition);
            yPosition += lessonLines.length * 4;
          }
          yPosition += 2;
        });
      }
      yPosition += 5;
    });
  }

  // Save PDF
  doc.save(`${course.topic.replace(/\s+/g, '_')}_Study_Plan.pdf`);
};

