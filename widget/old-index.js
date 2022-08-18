widget1();

async function widget1() {
    // getting the script id
    const widgetID = document?.currentScript?.id;

    // widget class
    const wc = "." + widgetID;

    async function getConfig() {
        // fetch request to get the config
        const result = await fetch(document.currentScript.dataset.config);
        const config = await result.json();
        return config;
    }

    const config = await getConfig();

    console.log(config);

    defer();

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
        // html template
        let theHTML = `
            <section class="section-1" id="1">
                <div class="container">
                    <header class="section-header">
                        <h2 class="h1">${config.header}</h2>
                        <p class="h2">${config.subHeader}</p>
                    </header>

                    <div>${config.bodyText}</div>

                    <div class="learn">
                        <button class="btn-learn"type="button">${config.btnText}</button>
                    </div>
                </div>
            </section>
        `;

        // appending html to the div
        $(wc).append(theHTML);
        $(".btn-learn").click(function () {
            window.open(`${config.learnMoreURL}`, "_blank");
        });
    }
}



{/* <div id="redata-widget-container">
                    <div class="redata-widget-container-header">
                        <h1>Comment</h1>
                        
                        <span>x</span>
                    </div>
                    
                    <ul class="redata-widget-container-comments">
                        <li>
                            <div>
                                some here
                            </div>
                        </li>
                        <li>
                            <div>
                                some here
                            </div>
                        </li>
                    </ul>
                </div>
            <div id="redata-widget-container">
                    <div class="redata-widget-container-header">
                        <h1>Comment</h1>
                        
                        <span>x</span>
                    </div>
                    
                    <ul class="redata-widget-container-comments">
                        <li>
                            <div>
                                some here
                            </div>
                        </li>
                        <li>
                            <div>
                                some here
                            </div>
                        </li>
                    </ul>

                    <div class="redata-widget-footer">
                        <input type="text" placeholder="Write a comment..." />
                        
                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
            */}



            // renderSelector();
            // document.body.style.width = "80%";
            // document.getElementById('redata-widget-section-container').style.cssText = `
            //     width: 20%;
            //     height: 100%;
            //     top: 0;
            //     position: fixed;
            // `;
            // document.getElementById('redata-widget-container').style.display = "block";
            // document.body.addClass = "re-data-widget-overlay";

            // add an overlay to the body
            // $('body').addClass('re-data-widget-overlay');

            // console.log('clicked');
            // window.open(`${config.learnMoreURL}`, "_blank");