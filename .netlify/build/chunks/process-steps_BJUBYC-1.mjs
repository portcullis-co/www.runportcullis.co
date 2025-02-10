import { a as createComponent, r as renderTemplate, m as maybeRenderHead } from './astro/server_Dkj-vugl.mjs';
import 'clsx';

const $$ProcessSteps = createComponent(($$result, $$props, $$slots) => {
  const steps = [
    {
      number: "01",
      title: "Assessment",
      description: "We analyze your current infrastructure and deployment needs to create a strategy."
    },
    {
      number: "02",
      title: "Planning",
      description: "Develop a detailed deployment plan including architecture, tools, and timeline."
    },
    {
      number: "03",
      title: "Implementation",
      description: "Set up infrastructure, configure CI/CD pipelines, and implement monitoring."
    },
    {
      number: "04",
      title: "Testing",
      description: "Rigorous testing of deployment processes and failover procedures."
    },
    {
      number: "05",
      title: "Deployment",
      description: "Execute the deployment plan with careful monitoring and immediate support."
    },
    {
      number: "06",
      title: "Maintenance",
      description: "Ongoing support, monitoring, and optimization of your deployment."
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section class="relative bg-white overflow-hidden py-20"> <div class="absolute inset-0"> <div class="absolute inset-0 bg-white"></div> <div class="absolute inset-0 bg-grid-black/[0.05] bg-grid-16"></div> </div> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"> <div class="text-center mb-16"> <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Deployment Process</h2> <p class="text-xl text-gray-700">A systematic approach to ensure successful deployments</p> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> ${steps.map((step) => renderTemplate`<div class="relative group"> <div class="absolute -inset-0.5 bg-gradient-to-r from-[#faff69] to-black rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-300"></div> <div class="relative p-6 bg-white rounded-lg shadow-md"> <div class="text-5xl font-bold text-black mb-4">${step.number}</div> <h3 class="text-xl font-semibold text-gray-900 mb-2">${step.title}</h3> <p class="text-gray-700">${step.description}</p> </div> </div>`)} </div> </div> </section>`;
}, "/Users/jdbohrman/www.runportcullis.co/src/components/sections/process-steps.astro", void 0);

export { $$ProcessSteps as $ };
