const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const questions = [
  {
    type: 'list',
    message: "What is the team member's role?",
    choices: ['Manager', 'Engineer', 'Intern'],
    name: 'role',
  },
  {
    type: 'input',
    message: "What is the team member's name?",
    name: 'name',
  },
  {
    type: 'input',
    message: "What is the team member's email?",
    name: 'email',
  },
  {
    type: 'number',
    message: "What is their office number?",
    name: 'officeNumber',
    when: ({ role }) => role === 'Manager',
  },
  {
    type: 'input',
    message: 'What is their github?',
    name: 'github',
    when: ({ role }) => role === 'Engineer',
  },
  {
    type: 'input',
    message: 'What is their school?',
    name: 'school',
    when: ({ role }) => role === 'Intern',
  },
  {
    type: 'confirm',
    message: 'Add another team member?',
    name: 'addMember',
    default: true,
  }
];

const teamMembers = [];
let id = 1;

function saveOutput(path, data) {
  fs.writeFile(path, data, (err) => {
    if (err) {
      fs.mkdir(OUTPUT_DIR, (mkdirErr) => {
        if (mkdirErr) {
          throw mkdirErr;
        } else {
          fs.writeFile(path, data, (writeErr2) => {
            if (writeErr2) {
              throw writeErr2;
            } else {
              console.log('Saved successfully!');
            }
          });
        }
      });
    } else {
      console.log('Saved succesfully!');
    }
  });
}

async function main() {
  const response = await inquirer.prompt(questions);
  switch (response.role) {
    case 'Manager':
      teamMembers.push(new Manager(response.name, id, response.email, response.officeNumber));
      break;
    case 'Engineer':
      teamMembers.push(new Engineer(response.name, id, response.email, response.github));
      break;
    case 'Intern':
      teamMembers.push(new Intern(response.name, id, response.email, response.school));
      break;
    default:
      throw new Error(`Unknown role: ${response.role}.`);
  }
  id++;
  if (response.addMember) {
    main();
  } else {
    const html = render(teamMembers);
    saveOutput(outputPath, html);
  }
}

main();

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
