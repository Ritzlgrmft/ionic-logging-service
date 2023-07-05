'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">ionic-logging-viewer</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/LoggingViewerModule.html" data-type="entity-link" >LoggingViewerModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-LoggingViewerModule-dacb7c255cb51aa24b0a38f2af47ec845a0b1f88effff4b23a97485b9d48de88d0eec8eb050c1b216a1b931f8d1a56f4b889a76b84c628b5f997ddd7234bd481"' : 'data-bs-target="#xs-components-links-module-LoggingViewerModule-dacb7c255cb51aa24b0a38f2af47ec845a0b1f88effff4b23a97485b9d48de88d0eec8eb050c1b216a1b931f8d1a56f4b889a76b84c628b5f997ddd7234bd481"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LoggingViewerModule-dacb7c255cb51aa24b0a38f2af47ec845a0b1f88effff4b23a97485b9d48de88d0eec8eb050c1b216a1b931f8d1a56f4b889a76b84c628b5f997ddd7234bd481"' :
                                            'id="xs-components-links-module-LoggingViewerModule-dacb7c255cb51aa24b0a38f2af47ec845a0b1f88effff4b23a97485b9d48de88d0eec8eb050c1b216a1b931f8d1a56f4b889a76b84c628b5f997ddd7234bd481"' }>
                                            <li class="link">
                                                <a href="components/LoggingViewerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoggingViewerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoggingViewerLevelsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoggingViewerLevelsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoggingViewerModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoggingViewerModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoggingViewerSearchComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoggingViewerSearchComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-LoggingViewerModule-dacb7c255cb51aa24b0a38f2af47ec845a0b1f88effff4b23a97485b9d48de88d0eec8eb050c1b216a1b931f8d1a56f4b889a76b84c628b5f997ddd7234bd481"' : 'data-bs-target="#xs-injectables-links-module-LoggingViewerModule-dacb7c255cb51aa24b0a38f2af47ec845a0b1f88effff4b23a97485b9d48de88d0eec8eb050c1b216a1b931f8d1a56f4b889a76b84c628b5f997ddd7234bd481"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-LoggingViewerModule-dacb7c255cb51aa24b0a38f2af47ec845a0b1f88effff4b23a97485b9d48de88d0eec8eb050c1b216a1b931f8d1a56f4b889a76b84c628b5f997ddd7234bd481"' :
                                        'id="xs-injectables-links-module-LoggingViewerModule-dacb7c255cb51aa24b0a38f2af47ec845a0b1f88effff4b23a97485b9d48de88d0eec8eb050c1b216a1b931f8d1a56f4b889a76b84c628b5f997ddd7234bd481"' }>
                                        <li class="link">
                                            <a href="injectables/LoggingViewerFilterService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoggingViewerFilterService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/LoggingViewerModalProperties.html" data-type="entity-link" >LoggingViewerModalProperties</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoggingViewerTranslation.html" data-type="entity-link" >LoggingViewerTranslation</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});