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

class ProjectList{
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

    // Append section to div with class 'app'
    this.renderHook.append(projectSectionEl);
  }
}

class ProjectCard {
  constructor(project) {
    this.project = project;
    this.makeDraggable();
  }

  makeDraggable() {
    //console.log('drag');
  }

  toggleProjectStatus() {
    this.project.toggleStatus();

    document.getElementById('app').textContent = null;

    App.activeProjectSection.render(App.projectList);
    App.completedProjectSection.render(App.projectList);
  }

  toggleTooltip() {
    this.previousElementSibling.classList.toggle('hidden');
    this.innerHTML = (this.innerHTML == 'Close') ? 'More Info' : 'Close';
  }

  render() {
    const projectCard = document.createElement('li');
    projectCard.classList.add('card');
    projectCard.setAttribute('data-extra-info', this.project.extraInfo)
    projectCard.innerHTML = `
      <h2>${this.project.title}</h2>
      <p>${this.project.description}</p>
      <button class="alt">More Info</button>
      <button>${this.project.completed ? "Mark Active" : "Mark Completed"}</button>
    `;

    const moreInfoBtn = projectCard.querySelector('button:first-of-type');
    const tooltip = new Tooltip(moreInfoBtn, this.project.extraInfo).init();
    moreInfoBtn.addEventListener('click', this.toggleTooltip.bind(moreInfoBtn));
    
    const changeStatusBtn = projectCard.querySelector('button:last-of-type');
    changeStatusBtn.addEventListener('click', () => { this.toggleProjectStatus() });

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
    tooltip.id = 'tooltip';
    tooltip.classList.add('tooltip', 'hidden');
    tooltip.innerHTML = `
      <div class="tooltip">
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
    new Project('p1', 'Finish the Course', 'Finish the course within the next two weeks.', 'Got lifetime access, but would be nice to finish it soon!'),
    new Project('p2', 'Buy Groceries', 'Don\'t forget to pick up groceries today.', 'Not really a business topic but still important.'),
    new Project('p3', 'Book Hotel', 'Conference takes place in December, don\'t forget to book a hotel.', 'Super important conference!')
  ];

  static renderHook = document.getElementById('app');

  static projectList = new ProjectList();
  static activeProjectSection = new ActiveProjectSection(this.renderHook);
  static completedProjectSection = new CompletedProjectSection(this.renderHook);
  //static tooltip = new Tooltip();

  static init() {
    // Seed list
    this.projects[2].completed = true;
    this.projects.forEach(project => {
      this.projectList.add(project);
    });

    this.activeProjectSection.render(this.projectList);
    this.completedProjectSection.render(this.projectList);
  }
}

App.init();