class Project {
  constructor(id, title, description, extraInfo) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.extraInfo = extraInfo;
    this.completed = false; 
  }

  toggleStatus() {
    this.completed = (this.completed === false) ? true : false
  }
}

class ProjectList {
  projects = [];

  add(project) {
    this.projects.push(project);
  }
}

class ProjectSection {
  constructor(renderHook) {
    this.renderHook = renderHook;
  }
}

class ActiveProjectSection extends ProjectSection {
  render(projectList) {
    let projectSectionEl = document.createElement('section');
    projectSectionEl.setAttribute('id', 'active-projects');
    projectSectionEl.innerHTML = `
      <header>
        <h2>Active Projects</h2>
      </header>
      <ul></ul>
    `;

    projectList.projects.forEach(project => {
      if (!project.completed) {
        projectSectionEl.querySelector('ul').append(new ProjectCard(project).render());
      }
    });

    // Drag/drop functionality
    const ulEl = projectSectionEl.querySelector('ul');

    ulEl.addEventListener('dragover', ev => {
      ev.preventDefault();
    });

    ulEl.addEventListener('drop', ev => {
      ev.preventDefault();
      const projId = ev.dataTransfer.getData("text/plain");
      App.projectList.projects.forEach(project => {
        if (+project.id === +projId) { 
          project.completed = false;
          App.refresh(); 
        }
      });
    });
    
    // Append section to div with class 'app'
    this.renderHook.append(projectSectionEl);
  }
}

class CompletedProjectSection extends ProjectSection {
  render(projectList) {
    let projectSectionEl = document.createElement('section');
    projectSectionEl.setAttribute('id', 'completed-projects');
    projectSectionEl.innerHTML = `
      <header>
        <h2>Completed Projects</h2>
      </header>
      <ul></ul>
    `;

    projectList.projects.forEach(project => {
      if (project.completed) {
        projectSectionEl.querySelector('ul').append(new ProjectCard(project).render());
      }
    });

    // Drag/drop functionality
    const ulEl = projectSectionEl.querySelector('ul');

    ulEl.addEventListener('dragover', ev => {
      ev.preventDefault();
    });

    ulEl.addEventListener('drop', ev => {
      ev.preventDefault();
      const projId = ev.dataTransfer.getData("text/plain");
      App.projectList.projects.forEach(project => {
        if (+project.id === +projId) { 
          project.completed = true;
          App.refresh();
        }
      });
    });

    // Append section to div with class 'app'
    this.renderHook.append(projectSectionEl);
  }
}

class ProjectCard {
  constructor(project) {
    this.project = project;
  }

  toggleProjectStatus() {
    this.project.toggleStatus();
    App.refresh();
  }

  toggleTooltip() {
    this.previousElementSibling.classList.toggle('hidden');
    this.innerHTML = (this.innerHTML == 'Close') ? 'More Info' : 'Close';
  }

  render() {
    const projectCard = document.createElement('li');
    projectCard.classList.add('card');
    projectCard.setAttribute('data-id', this.project.id);
    projectCard.setAttribute('data-extra-info', this.project.extraInfo);
    projectCard.innerHTML = `
      <h2>${this.project.title}</h2>
      <p>${this.project.description}</p>
      <button class="alt">More Info</button>
      <button>${this.project.completed ? "Mark Active" : "Mark Completed"}</button>
    `;

    const moreInfoBtn = projectCard.querySelector('button:first-of-type');
    new Tooltip(moreInfoBtn, this.project.extraInfo).init();
    moreInfoBtn.addEventListener('click', this.toggleTooltip.bind(moreInfoBtn));
    
    const changeStatusBtn = projectCard.querySelector('button:last-of-type');
    changeStatusBtn.addEventListener('click', () => { this.toggleProjectStatus() });

    // Drag/drop functionality
    projectCard.setAttribute('draggable', true);
    projectCard.addEventListener('dragstart', ev => { 
      ev.dataTransfer.setData('text/plain', ev.target.dataset.id);
    })

    return projectCard;
  }
}

class Tooltip {
  constructor(boundToElement, tooltipText) {
    this.boundToElement = boundToElement;
    this.tooltipText = tooltipText;
  }

  init() {
    const tooltip = document.createElement('span');
    tooltip.classList.add('hidden');
    tooltip.innerHTML = `
      <div class="tooltip-body">
        <h2>More Info</h2>
        <p>${this.tooltipText}</p>
      </div>
      <div class="tooltip-arrow">
    `;

    this.boundToElement.parentElement.insertBefore(tooltip, this.boundToElement);
  }
}

class App {
  // Seed data
  static projects = [
    new Project(1, 'Finish the Course', 'Finish the course within the next two weeks.', 'Got lifetime access, but would be nice to finish it soon!'),
    new Project(2, 'Buy Groceries', 'Don\'t forget to pick up groceries today.', 'Not really a business topic but still important.'),
    new Project(3, 'Book Hotel', 'Conference takes place in December, don\'t forget to book a hotel.', 'Super important conference!')
  ];

  static renderHook = document.getElementById('app');

  static projectList = new ProjectList();
  static activeProjectSection = new ActiveProjectSection(this.renderHook);
  static completedProjectSection = new CompletedProjectSection(this.renderHook);

  static init() {
    // Seed list
    this.projects[2].completed = true;
    this.projects.forEach(project => {
      this.projectList.add(project);
    });

    this.activeProjectSection.render(this.projectList);
    this.completedProjectSection.render(this.projectList);
  }

  static refresh() {
    this.renderHook.innerHTML = null;
    this.activeProjectSection.render(App.projectList);
    this.completedProjectSection.render(App.projectList);
  }
}

App.init();