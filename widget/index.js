
console.log('loaded');

const getFullPath = (targetElement, exact = true) => {
    const stack = [];
    let nextElement = targetElement;

    while (nextElement.nodeName !== 'HTML') {
        const nodeName = nextElement.nodeName.toLowerCase();

        if (nextElement.getAttribute('id')) {
            stack.unshift(`#${nextElement.id}`);
        } else if (nextElement.getAttribute('class')) {
            const index = exact ? getPosAsChildOfParent(nextElement) : null;

            stack.unshift(
                `${nodeName}.${Array.from(nextElement.classList).join('.')}${exact ? `:nth-child(${index})` : ''}`,
            );
        } else {
            const index = exact ? getPosAsChildOfParent(nextElement) : null;

            stack.unshift(`${nodeName}${exact ? `:nth-child(${index})` : ''}`);
        }

        nextElement = nextElement.parentNode;
    }

    return `html > ${stack.join(' > ')}`;
};

const getPosAsChildOfParent = (sib) => {
    const parentChildCount = sib.parentNode.childElementCount;

    if (!sib.nextElementSibling) {
        if (parentChildCount > 0) {
            return parentChildCount;
        } else {
            return 0;
        }
    }

    let count = 0;
    let currentSib = sib;

    while (currentSib) {
        const nextSib = currentSib.nextElementSibling;
        if (nextSib) {
            count += 1;
            currentSib = nextSib;
        } else {
            currentSib = null;
        }
    }

    return parentChildCount - count;
};

const truncateFullPath = (fullPath) => {
    const paths = fullPath.split('>');

    if (paths.length > 1) {
        return `... > ${paths[paths.length - 1]}`;
    }

    return fullPath;
};


const data = localStorage.getItem('redata_funnel');
let activeFunnel = null;
let isSelectorActive = false;
let steps = data ? JSON.parse(data) : [];
let isSideBarOpen = false;


widget1();


const appendStep = (step, index) => {
    const node = document.createElement('li'); // Create a <li> node

    node.classList.add("widget__step");

    // console.log(index, 'append step');

    node.setAttribute('data-funnel-step', step.index);

    node.innerHTML += `
        <div>
			<span class="widget__index">${index}</span>
		</div> 
		<div id="step-funnel-${step.index}">
			<span class="title_text">${step.action} </span>
			<span class="subtitle_text" title='${step.value}'>${truncateFullPath(step.value)} </span>
		</div> 
		<div>
            <button id="step-remove-${step.index}" >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 0C3.57333 0 0 3.57333 0 8C0 12.4267 3.57333 16 8 16C12.4267 16 16 12.4267 16 8C16 3.57333 12.4267 0 8 0ZM10.3111 11.3778C9.54667 10.6133 8.76444 9.83111 8 9.06667C7.23556 9.83111 6.45333 10.6133 5.68889 11.3778C4.99556 12.0711 3.94667 11.0044 4.62222 10.3111C5.38667 9.54667 6.16889 8.76444 6.93333 8C6.16889 7.23556 5.38667 6.45333 4.62222 5.68889C3.92889 4.99556 4.99556 3.94667 5.68889 4.62222C6.45333 5.38667 7.23556 6.16889 8 6.93333C8.76444 6.16889 9.54667 5.38667 10.3111 4.62222C11.0044 3.92889 12.0533 4.99556 11.3778 5.68889C10.6133 6.45333 9.83111 7.23556 9.06667 8C9.83111 8.76444 10.6133 9.54667 11.3778 10.3111C12.0533 10.9867 10.9867 12.0533 10.3111 11.3778Z" fill="#CCCCCC" />
                </svg>
            </button>
		</div>`;

    document?.querySelector('.widget__steps')?.appendChild(node);
};


const renderSteps = (steps) => {
    steps.forEach((step, index) => appendStep(step, index + 1));
};

const reRenderSteps = (steps) => {
    var e = document.querySelector('.widget__steps');
    //remove all elements and add to it
    var child = e?.lastElementChild;
    while (child) {
        e?.removeChild(child);
        child = e?.lastElementChild;
    }

    renderSteps(steps);
    rerenderStepCount();
};


const rerenderStepCount = () => {
    const stepCount = document.querySelector('#widget-count');
    const stepLastCount = document.querySelector('#widget-last-count');

    if (stepCount) {
        stepCount.innerHTML = `<span id='widget-count'>${steps.length} STEP</span>`;
    }
    if (stepLastCount) {
        stepLastCount.innerHTML = `<span id='widget-last-count'>${steps.length + 1}</span>`;
    }
};

const renderSelector = () => {
    console.log('i am here');
    return `
        <div class="selector" id="selector">
            <div>
                <p id='redata_selector_text'>
                    Select an element on the page
                    <button id='redata_selector_close'>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 8.63083C0 8.29183 0.122498 7.99984 0.367493 7.75484L3.12237 4.99996L0.367493 2.23098C0.122498 1.99539 0 1.70809 0 1.36909C0 1.03009 0.122498 0.742797 0.367493 0.507202C0.612489 0.271606 0.899786 0.153809 1.22938 0.153809C1.55898 0.153809 1.84628 0.271606 2.09128 0.507202L4.86025 3.27618L7.61513 0.507202C7.85073 0.271606 8.13803 0.153809 8.47702 0.153809C8.81602 0.153809 9.10332 0.271606 9.33891 0.507202C9.57451 0.742797 9.69231 1.03009 9.69231 1.36909C9.69231 1.70809 9.57451 1.99539 9.33891 2.23098L6.58404 4.99996L9.33891 7.75484C9.57451 7.99984 9.69231 8.29183 9.69231 8.63083C9.69231 8.96983 9.57451 9.25713 9.33891 9.49272C9.10332 9.72832 8.81602 9.84612 8.47702 9.84612C8.13803 9.84612 7.85073 9.72832 7.61513 9.49272L4.86025 6.73784L2.09128 9.49272C1.85568 9.72832 1.56838 9.84612 1.22938 9.84612C0.890386 9.84612 0.603089 9.72832 0.367493 9.49272C0.122498 9.24773 0 8.96043 0 8.63083Z" fill="#FFF"/>
                        </svg>
                    </button>
                </p>
            </div>
        </div>
    `;
};

const renderSelectAction = (options) => {
    return `<select name="action" id="funnel_actions" style="
    position: absolute;
    right: -5px;
    background: #392396;
    color: #242424;
    padding: 9px 8px;
    font-size: 14px;
    border: 1px solid #392396;
	outline:none;
">
	${options.map((option) => `<option value="${option}" ${getValue() === option ? 'selected' : ''}>${option}</option>`)}
  </select>`;
};

const createWrapper = (t) => {
    //Hide widget selector

    removeActiveState();

    const wrapper = document.createElement('div');

    wrapper.classList.add('active-select');

    wrapper.style.borderWidth = '5px';
    wrapper.style.borderColor = '#392396';
    wrapper.style.borderStyle = 'solid';
    wrapper.style.position = 'relative';
    wrapper.style.background = 'white';

    // insert wrapper before el in the DOM tree
    t.parentNode.insertBefore(wrapper, t);
    // move el into wrapper
    wrapper.appendChild(t);

    const nodeName = t.nodeName.toLowerCase();

    // wrapper.innerHTML += `${renderSelectAction(renderOptionValues(nodeName))}`;

    //Hide selector
    const selector = document.getElementById('selector');
    if (selector) selector.style.visibility = 'hidden';
    isSelectorActive = false;

    const selectElement = document.getElementById('funnel_actions');
    const widgetFunnel = document.querySelector('#widget-funnel');

    if (widgetFunnel) {
        widgetFunnel.style.visibility = 'visible';
    }

    if (selectElement) {
        selectElement.addEventListener('change', onSelect);
    }
};


const removeActiveState = () => {
    const isActiveSelect = document.querySelector('.active-select');

    if (isActiveSelect) {
        const select = isActiveSelect.querySelector('#funnel_actions');
        if (select) {
            select.remove();
        }
        isActiveSelect.outerHTML = isActiveSelect.innerHTML;
    }
};

const hideSideBar = () => {
    isSideBarOpen = false;
    document.body.style.width = "100%";
    document.getElementById('redata-widget-logo-container').style.display = "block";
    document.getElementById('redata-widget-section-container').style.width = "0%";
    document.getElementById('redata-widget-container').style.display = "none";
}

const showSideBar = () => {
    isSideBarOpen = true;
    document.body.style.width = "80%";
    document.getElementById('redata-widget-logo-container').style.display = "none";
    document.getElementById('redata-widget-section-container').style.cssText = `
        width: 20%;
        height: 100%;
        top: 0;
        position: fixed;
    `;
    document.getElementById('redata-widget-container').style.display = "block";
}

const getAllFunnelIds = () => {
    const activeSelection = document.getElementsByClassName('redata-widget-add-selected-border')

    const funnelIds = new Set();
    for (let index = 0; index < activeSelection.length; index++) {
        const funnelId = activeSelection[index]?.getAttribute('data-funnel-id');

        if (funnelId) {
            funnelIds.add(funnelId);
        }
    }

    return funnelIds;
}

const onClick = (event) => {
    event.preventDefault();

    const { target } = event;
    const widgetFunnel = document.querySelector('#widget-funnel');
    const widgetIcon = document.querySelector('#widget-icon');
    const selector = document.getElementById('selector');

    // const activeSelection = document.getElementsByClassName('redata-widget-add-selected-border')

    const funnelIds = getAllFunnelIds();
    const targetFunnelId = target?.getAttribute('data-funnel-id');
    if (targetFunnelId && funnelIds.has(targetFunnelId)) {
        console.log('funnelId', funnelIds);
        if (!isSideBarOpen) {
            showSideBar();
        } else {
            hideSideBar();
        }
    }
    // console.log('activeSelection', activeSelection, target?.getAttribute('data-funnel-id'));

    // Listen for hot_jar selector close
    if (event.altKey) {
        selector.style.visibility = 'visible';
        isSelectorActive = true;
        removeActiveState();

        // widgetFunnel.style.visibility = 'hidden';

        return;
    }

    if (isSelectorActive && target.id !== 'redata_selector_close' && target.id !== 'redata_selector_text') {
        //Check if attribute already has id
        if (!target.getAttribute('data-funnel-id')) {
            //Use attribute id or generate random id
            const id = target.id ? `#${target.id}` : getFullPath(target);

            const step = {
                action: 'CLICK',
                value: id,
                index: steps.length + 1,
                currentPage: window.location.href,
                isUrl: false,
            };
            steps.push(step);

            activeFunnel = steps.length;

            localStorage.setItem('redata_funnel', JSON.stringify(steps));
            //Add attribute to
            target.setAttribute('data-funnel-id', steps.length);
            // appendStep(step, step.index);
            reRenderSteps(steps);

            console.log('okay from step')
        } else {
            activeFunnel = parseInt(target.getAttribute('data-funnel-id'));
        }

        showSideBar();
        createWrapper(target);
    } else {
        //Close widget
        if (target && target.id === 'close-widget') {
            widgetFunnel.style.visibility = 'hidden';
            widgetIcon.style.visibility = 'visible';
            return;
        }

        //Clear all steps added
        if (target && target.id === 'reset-funnel') {
            localStorage.removeItem('redata_funnel');
            removeActiveState();
            steps = [];
            reRenderSteps([]);
            return;
        }

        if (target && target.id === 'save-funnel') {
            onSubmit();
            return;
        }

        if (target && target.id === 'widget-icon') {
            widgetFunnel.style.visibility = 'visible';
            widgetIcon.style.visibility = 'hidden';
            return;
        }

        //Close selector

        if (target && target.id === 'redata_selector_close') {
            isSelectorActive = false;
            selector.style.visibility = 'hidden';
            widgetFunnel.style.visibility = 'visible';
            return;
        }

        // Remove selected step

        if (target && target.id.includes('step-remove')) {
            const id = target.id;
            const dataSet = id.split('-');
            removeStep(dataSet[dataSet.length - 1]);
            return;
        }

        //Activate selected step on click of a paricular step
        if (target && (target.id.includes('step-funnel') || event.target.parentNode.id.includes('step-funnel'))) {
            //Remove active id the is already active state
            removeActiveState();
            let parentElement = event.target;
            //get parent li
            while (parentElement.nodeName !== 'LI') {
                parentElement = parentElement.parentNode;
            }
            console.log({ parentElement });
            const index = parentElement.getAttribute('data-funnel-step');
            activeFunnel = parseInt(index);
            const { value } = steps.find((step) => step.index === parseInt(index));
            createWrapper(document.querySelector(value));
        }
    }
};

const repopulateElements = (steps) => {
    const currentPage = window.location.href;

    steps.forEach((step) => {
        if (step.action === 'visited') return;

        if (currentPage === step.currentPage) {
            const htmlElement = document.querySelector(step.value);

            htmlElement.setAttribute('data-funnel-id', step.index);
            htmlElement.classList.add('redata-widget-add-selected-border');
        }
    });
};

async function widget1() {
    console.log('loaded widget1');

    const tag = document.createElement("div");
    tag.className = 'widget-1';
    document.body.appendChild(tag);

    // getting the script id
    const widgetID = document?.currentScript?.id;

    // widget class
    const wc = "." + widgetID;

    console.log('wc ', wc);

    async function getConfig() {
        // fetch request to get the config
        const result = await fetch(document.currentScript.dataset.config);
        const config = await result.json();
        return config;
    }

    const config = await getConfig();

    console.log(config);

    // defer();

    // loading jQuery dynamically
    function defer(method) {
        if (window.jQuery) {
            init($);
            return;
        } else {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = config.jqueryURL;
            document.getElementsByTagName("head")[0].appendChild(script);
            setTimeout(function () {
                defer(method);
            }, 50);
        }
    }

    function init($) {
        console.log('jquery loaded');
        // html template
        let theHTML = `
            <section id="redata-widget-section-container">
                <div id="redata-widget-logo-container">
                    <img
                        src=${config.logoUrl}
                        alt="re-data"
                        class="redata-widget-logo"
                        title="Open Comments"
                    >
                </div>

                <div id="redata-widget-container">
                    <div class="redata-widget-header">
                        <h1><img src="https://uploads-ssl.webflow.com/60bdbc7b0c4f5aa1568dc8cc/60df3224a3b3637230f335d6_REDATA%20LOGO%2011.svg" alt="re-data logo" />Comments</h1>

                        <button onclick="hideSideBar()">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                    </div>

                    <div class="redata-widget-title">
                        <h3>Some page title here</h3>
                    </div>

                    <ul class="redata-widget-comments">
                        <li>
                        <div>
                            <div class="comment-header">
                            <h5>Emmanuel</h5>

                            <span>22/10/2022</span>
                            </div>
                            <p>@deji Lorem ipsum dolor sit, amet consectetur adipisicing elit. Pariatur vitae sint voluptatem dignissimos totam accusantium sapiente velit tenetur. Quod, eveniet deleniti voluptas aut voluptatum rerum odit. Veniam, soluta. Vitae, quasi?</p>
                        </div>
                        </li>
                        <li>
                        <div>
                            <div class="comment-header">
                            <h5>Emmanuel</h5>

                            <span>22/10/2022</span>
                            </div>
                            <p>@deji Lorem ipsum dolor sit, amet consectetur adipisicing elit. Pariatur vitae sint voluptatem dignissimos totam accusantium sapiente velit tenetur. Quod, eveniet deleniti voluptas aut voluptatum rerum odit. Veniam, soluta. Vitae, quasi?</p>
                        </div>
                        </li>
                        <li>
                        <div>
                            <div class="comment-header">
                            <h5>Emmanuel</h5>

                            <span>22/10/2022</span>
                            </div>
                            <p>@deji Lorem ipsum dolor sit, amet consectetur adipisicing elit. Pariatur vitae sint voluptatem dignissimos totam accusantium sapiente velit tenetur. Quod, eveniet deleniti voluptas aut voluptatum rerum odit. Veniam, soluta. Vitae, quasi?</p>
                        </div>
                        </li>
                        <li>
                        <div>
                            <div class="comment-header">
                            <h5>Emmanuel</h5>

                            <span>22/10/2022</span>
                            </div>
                            <p>@deji Lorem ipsum dolor sit, amet consectetur adipisicing elit. Pariatur vitae sint voluptatem dignissimos totam accusantium sapiente velit tenetur. Quod, eveniet deleniti voluptas aut voluptatum rerum odit. Veniam, soluta. Vitae, quasi?</p>
                        </div>
                        </li>
                        <li>
                        <div>
                            <div class="comment-header">
                            <h5>Emmanuel</h5>

                            <span>22/10/2022</span>
                            </div>
                            <p>@deji Lorem ipsum dolor sit, amet consectetur adipisicing elit. Pariatur vitae sint voluptatem dignissimos totam accusantium sapiente velit tenetur. Quod, eveniet deleniti voluptas aut voluptatum rerum odit. Veniam, soluta. Vitae, quasi?</p>
                        </div>
                        </li>
                        <li>
                        <div>
                            <div class="comment-header">
                            <h5>Emmanuel</h5>

                            <span>22/10/2022</span>
                            </div>
                            <p>@deji Lorem ipsum dolor sit, amet consectetur adipisicing elit. Pariatur vitae sint voluptatem dignissimos totam accusantium sapiente velit tenetur. Quod, eveniet deleniti voluptas aut voluptatum rerum odit. Veniam, soluta. Vitae, quasi?</p>
                        </div>
                        </li>
                        <li>
                        <div>
                            <div class="comment-header">
                            <h5>Emmanuel</h5>

                            <span>22/10/2022</span>
                            </div>
                            <p>@deji Lorem ipsum dolor sit, amet consectetur adipisicing elit. Pariatur vitae sint voluptatem dignissimos totam accusantium sapiente velit tenetur. Quod, eveniet deleniti voluptas aut voluptatum rerum odit. Veniam, soluta. Vitae, quasi?</p>
                        </div>
                        </li>
                        <li>
                        <div>
                            <div class="comment-header">
                            <h5>Emmanuel</h5>

                            <span>22/10/2022</span>
                            </div>
                            <p>@deji Lorem ipsum dolor sit, amet consectetur adipisicing elit. Pariatur vitae sint voluptatem dignissimos totam accusantium sapiente velit tenetur. Quod, eveniet deleniti voluptas aut voluptatum rerum odit. Veniam, soluta. Vitae, quasi?</p>
                        </div>
                        </li>
                        <li>
                        <div>
                            <div class="comment-header">
                            <h5>Emmanuel</h5>

                            <span>22/10/2022</span>
                            </div>
                            <p>@deji Lorem ipsum dolor sit, amet consectetur adipisicing elit. Pariatur vitae sint voluptatem dignissimos totam accusantium sapiente velit tenetur. Quod, eveniet deleniti voluptas aut voluptatum rerum odit. Veniam, soluta. Vitae, quasi?</p>
                        </div>
                        </li>
                        <li>
                        <div>
                            <div class="comment-header">
                            <h5>Emmanuel</h5>

                            <span>22/10/2022</span>
                            </div>
                            <p>@deji Lorem ipsum dolor sit, amet consectetur adipisicing elit. Pariatur vitae sint voluptatem dignissimos totam accusantium sapiente velit tenetur. Quod, eveniet deleniti voluptas aut voluptatum rerum odit. Veniam, soluta. Vitae, quasi?</p>
                        </div>
                        </li>
                        <li>
                        <div>
                            <div class="comment-header">
                            <h5>Emmanuel</h5>

                            <span>22/10/2022</span>
                            </div>
                            <p>@deji Lorem ipsum dolor sit, amet consectetur adipisicing elit. Pariatur vitae sint voluptatem dignissimos totam accusantium sapiente velit tenetur. Quod, eveniet deleniti voluptas aut voluptatum rerum odit. Veniam, soluta. Vitae, quasi?</p>
                        </div>
                        </li>
                        <li>
                        <div>
                            <div class="comment-header">
                            <h5>Emmanuel</h5>

                            <span>22/10/2022</span>
                            </div>
                            <p>@deji Lorem ipsum dolor sit, amet consectetur adipisicing elit. Pariatur vitae sint voluptatem dignissimos totam accusantium sapiente velit tenetur. Quod, eveniet deleniti voluptas aut voluptatum rerum odit. Veniam, soluta. Vitae, quasi?</p>
                        </div>
                        </li>
                        <li>
                        <div>
                            <div class="comment-header">
                            <h5>Emmanuel</h5>

                            <span>22/10/2022</span>
                            </div>
                            <p>@deji Lorem ipsum dolor sit, amet consectetur adipisicing elit. Pariatur vitae sint voluptatem dignissimos totam accusantium sapiente velit tenetur. Quod, eveniet deleniti voluptas aut voluptatum rerum odit. Veniam, soluta. Vitae, quasi?</p>
                        </div>
                        </li>
                        <li>
                        <div>
                            <div class="comment-header">
                            <h5>Emmanuel</h5>

                            <span>22/10/2022</span>
                            </div>
                            <p>@deji Lorem ipsum dolor sit, amet consectetur adipisicing elit. Pariatur vitae sint voluptatem dignissimos totam accusantium sapiente velit tenetur. Quod, eveniet deleniti voluptas aut voluptatum rerum odit. Veniam, soluta. Vitae, quasi?</p>
                        </div>
                        </li>
                        <li>
                        <div>
                            <div class="comment-header">
                            <h5>Emmanuel</h5>

                            <span>22/10/2022</span>
                            </div>
                            <p>@deji Lorem ipsum dolor sit, amet consectetur adipisicing elit. Pariatur vitae sint voluptatem dignissimos totam accusantium sapiente velit tenetur. Quod, eveniet deleniti voluptas aut voluptatum rerum odit. Veniam, soluta. Vitae, quasi?</p>
                        </div>
                        </li>
                        <li>
                        <div>
                            <div class="comment-header">
                            <h5>Emmanuel</h5>

                            <span>22/10/2022</span>
                            </div>
                            <p>@deji Lorem ipsum dolor sit, amet consectetur adipisicing elit. Pariatur vitae sint voluptatem dignissimos totam accusantium sapiente velit tenetur. Quod, eveniet deleniti voluptas aut voluptatum rerum odit. Veniam, soluta. Vitae, quasi?</p>
                        </div>
                        </li>
                    </ul>

                    <div class="redata-widget-footer">
                        <textarea placeholder="Write a comment..." id=""></textarea>
                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-lihttps://srv.buysellads.com/ads/click/x/GTND42JNCTSD6K77CEYLYKQNCYYD52JYF6BDTZ3JCYSDT53EFT7I453KCA7I5237CYBDTK7WC6SITKJMFTBDL2QKC6SDKK3NCEBDTK3EHJNCLSIZnejoin="round" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                    </div>
                </div>

            </section>
        `;

        // appending html to the div
        // this.div.innerHTML = html;
        // $(wc).append(theHTML);
        wc.appendChild(theHTML);

        renderSteps(steps);

        document.querySelector('body').innerHTML += renderSelector();

        document.addEventListener('click', onClick);

        //Repopulate the elements page if reloaded or routed to another page
        repopulateElements(steps);


        // $(".redata-widget-logo").click(function () {
        // });

    }
}

console.log('loaded end');
