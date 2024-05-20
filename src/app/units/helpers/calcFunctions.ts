import { Trainee } from "src/app/models/trainee .model";

export const sortDataById = (studentId: string, studentsArr: Trainee[]) => {
    return studentsArr.find(student => student.id === studentId);
}

export const sortDataBySubject = (subjects: string[], studentsArr: Trainee[]) => {
    const averages = subjects.map(subject => {
        // Filter students who have the current subject
        const studentsWithSubject = studentsArr.filter(student => student.subject.toLowerCase() === subject.toLowerCase());
        
        // Calculate the average grade for the current subject
        const sum = studentsWithSubject.reduce((total, student) => total + student.grade, 0);
        const average = studentsWithSubject.length > 0 ? sum / studentsWithSubject.length : 0;

        return average;
    });

    return { data: averages, labels: subjects, name: 'students grades and average group by subject', isUpdated: true };
}

export const getSubjectsAndGradesById = (studentId: string, studentsArr: Trainee[]) => {
    const trainee = studentsArr.find(trainee => trainee.id === studentId);
  
    if (!trainee) {
      return { data: [], labels: [], name: '' };
    }
    
    const subjectsAndGrades = studentsArr
      .filter(trainee => trainee.id === studentId)
      .reduce((acc, trainee) => {
        acc[trainee.subject] = acc[trainee.subject] || [];
        acc[trainee.subject].push(trainee.grade);
        return acc;
      }, {});
  
    const labels = Object.keys(subjectsAndGrades);
    const data = labels.map(label => subjectsAndGrades[label]);
  
    return { data, labels, name: `${trainee.name} grades and average`, isUpdated: true };
  }