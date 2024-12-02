[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/DnqlZtdt)

# CollabPen: Design and Implementation Plan

## Project Overview

### App Link
[collabpen.ca](https://collabpen.ca/)

### Project Description
Inspired by [codepen.io](https://codepen.io/)

Online platform for showcasing and demoing code which allows users to type HTML, CSS, and JavaScript code, which is rendered in real-time. Multiple users can concurrently edit the same code, with changes being reflected for all users. Users can communicate through text or voice chat. Additional features include payment options, and an AI-assistant.

### Features
#### Main Features
- Users can type HTML, CSS, and JavaScipt code, and have the result rendered in real-time
- Users can invite others to their project, allowing for multiple users to collaborate on the same project, with code changes being reflected for all users
- Users can communicate with one another through text chat
- Payment integration through Stripe, allowing users to pay for credits for additional features

#### Stretch Goals
- Voice chat feature
- AI-assisted coding with LangChain. The platform will store user code into vector databases, and provide context-relevant feedback with Retrieval Augmented Generation

### Challenges
- Efficiently rendering a user's HTML, CSS, and JavaScript code in real-time
- Real-time collaboration between users. Letting multiple users edit the same code, having conflicts be resolved gracefully, and reflecting code changes across all users
- Security of the platform. Ensuring user code is properly quarantined to prevent malicious behaviour
- Integration with other API and frameworks such as Stripe, LangChain, LLMs
- Frontend technologies such as Bootstrap or Material UI
- Efficiently backend DB logic

## Technology Stack
Tentatively:
- Next.js
- Node.js with Express 
- PostgreSQL or MongoDB
- Stripe
- Socket.io
- LangChain
- (Library for rendering code)
- (Library to quarantine user code)

### Our Approach
We plan to start by breaking the project down into smaller pieces. Since there are many technologies required, we will create small projects for each technology (such as Stripe, Socket, BootStrap, etc). This will allow us to learn and validate each technology separately, reducing complexity and avoiding integration issues. This will also save time and lead to minimal refactoring.

Below we have a *tentative* schedule for our project. To keep on track, we will regularly update each other on our progress and frequently hold meetings.


## Milestones & Timeline
Very tentatively:

**Weeks 1-2 (Leading up to Demo)** 
- Set up a basic frontend with some library (learn Bootstrap/Material UI)
- Find library to render user code and setup a small project with it
- Develop a small project with Stripe
- Develop small project with Socket.io for real-time collaboration

**Weeks 3-4**
- Update application to have multiple users
    - Update frontend/backend to have registration/login functionality
- Implement real-time collaboration between users
- Implement payment functionality

**Weeks 5-6**
- Implement security features to quarantine user code
- **If time allows:** Add additional functionality such as text/voice chat, AI-assistant


