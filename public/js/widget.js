;(function(){
    var scriptBlockGlobal = document.querySelector('[data-widget-page-audit-id]');
    var scriptBlockId = scriptBlockGlobal && scriptBlockGlobal.dataset ? scriptBlockGlobal.dataset.widgetPageAuditId : 0;
    var scriptBlockSrc = scriptBlockGlobal.src;
    window.onload = function() {
        var cookieNameHideWidget = 'widget_page_audit_hide';

        if (getCookie(cookieNameHideWidget) == undefined) {
            var body = window.document.body,
                scriptBlock = document.querySelector('[data-widget-page-audit-id]'),
                userId = scriptBlock && scriptBlock.dataset ? scriptBlock.dataset.widgetPageAuditId : scriptBlockId,
                scriptSrc = scriptBlock ? scriptBlock.src : scriptBlockSrc,
                iFrameForm = document.createElement('iframe'),
                iFrameTrigger = document.createElement('iframe'),
                dataWidgetSerankingSettings = {};
                iFrameTrigger.classList.add('se-lead-generator-embed-frame-trigger');
                iFrameForm.classList.add('se-lead-generator-embed-frame-form');
            // script src origin
            var fakeLink = document.createElement('a');
            fakeLink.href = scriptSrc;
            var mainDomain = (function() {
                var url;
                if (!fakeLink.origin) {
                    url = fakeLink.protocol + '//' + fakeLink.hostname + (fakeLink.port ? ':' + fakeLink.port: '');
                }else{
                    url = fakeLink.origin;
                }
                return url;
            })();

            var widgetFormLink = mainDomain + '/leads_widget.do-form.html?id=' + userId;

            setDefaultValuesToIFrame(iFrameForm, widgetFormLink);
            insertAfter(iFrameForm, scriptBlock);
            hide(iFrameForm);

            // send linkFrom to iframe
            iFrameForm.onload = function() {
                postMessageFunc(iFrameForm.contentWindow, {
                    dataType: 'firstLoad',
                    id: userId,
                    link: window.location.href
                });
            }

            window.addEventListener('message', function (e) {
                var dataType = e.data.dataType;

                switch (dataType) {
                    case 'widgetSettings': {
                        dataWidgetSerankingSettings = e.data.val;
                        if (dataWidgetSerankingSettings.allow) {
                            firstLoad();
                        } else {
                            removeAll();
                        }
                        break;
                    }

                    case 'resizeIFrameTrigger': {
                        changeIFrameSize(iFrameTrigger, e.data.val.w, e.data.val.h);

                        startPositionForButton();
                        break;
                    }

                    case 'resizeIFrameForm': {
                        var iFrameFormHeight = e.data.val.h;

                        if (window.innerHeight < iFrameFormHeight && dataWidgetSerankingSettings.type != 'form') {
                            iFrameFormHeight = window.innerHeight;
                        }

                        changeIFrameSize(iFrameForm, e.data.val.w, iFrameFormHeight);
                        break;
                    }

                    case 'openForm': {
                        if (dataWidgetSerankingSettings.type != 'push') {
                            hide(iFrameTrigger);
                        }

                        setPositionForForm('15px');
                        show(iFrameForm);

                        postMessageFunc(iFrameForm.contentWindow, {
                            dataType: 'show'
                        });
                        break;
                    }

                    case 'closeForm': {
                        setPositionForForm('-5000px');
                        hide(iFrameForm);

                        if (iFrameTrigger.contentWindow) {
                            show(iFrameTrigger);

                            postMessageFunc(iFrameTrigger.contentWindow, {
                                dataType: 'show'
                            });
                        }
                        break;
                    }

                    case 'success': {
                        postMessageFunc(iFrameForm.contentWindow, {
                            dataType: 'success'
                        });
                        break;
                    }

                    case 'main_error': {
                        postMessageFunc(iFrameForm.contentWindow, {
                            dataType: 'main_error'
                        });
                        break;
                    }

                    case 'removeAll': {
                        removeAll();
                        break;
                    }
                }
            });
        }


        // FUNCTIONS

        function firstLoad() {
            startPositionForForm();

            // init trigger
            if (dataWidgetSerankingSettings.type != 'form' && dataWidgetSerankingSettings.type != 'popup') {
                var widgetTriggerLink = mainDomain + '/leads_widget.html?id=' + userId;

                setDefaultValuesToIFrame(iFrameTrigger, widgetTriggerLink);

                if (dataWidgetSerankingSettings.type == 'push'){
                    iFrameTrigger.style.position = 'relative';
                }

                insertAfter(iFrameTrigger, scriptBlock);

                iFrameTrigger.onload = function() {
                    resizeAllIFrames();

                    postMessageFunc(iFrameTrigger.contentWindow, {
                        dataType: 'show'
                    });
                };
            } else {
                show(iFrameForm);
                resizeAllIFrames();

                if (dataWidgetSerankingSettings.type == 'form') {
                    iFrameForm.style.zIndex = 1;
                }

                postMessageFunc(iFrameForm.contentWindow, {
                    dataType: 'show'
                });
            }
        }

        function setPositionForForm(strValPx) {
            if (dataWidgetSerankingSettings.type == 'button') {
                iFrameForm.style[dataWidgetSerankingSettings.position.split('_')[0]] = 0;
                iFrameForm.style[dataWidgetSerankingSettings.position.split('_')[1]] = strValPx;
            }
        }

        // form position
        function startPositionForForm() {
            if (dataWidgetSerankingSettings.type == 'button') {
                setPositionForForm('-5000px');
            } else if (dataWidgetSerankingSettings.type == 'form') {
                iFrameForm.style.position = 'relative';
            } else {
                iFrameForm.style.top = 0;
                iFrameForm.style.left = 0;
            }
        }

        function setDefaultValuesToIFrame(iFrame, iFrameSrc) {
            iFrame.src = iFrameSrc;
            iFrame.setAttribute('frameborder', 0);
            iFrame.style.border = 0;
            iFrame.style.position = 'fixed';
            iFrame.style.verticalAlign = 'top';
            iFrame.style.zIndex = 1000000;
            iFrame.style.margin = 0;
            iFrame.style.padding = 0;
            iFrame.scrolling = "no";
            iFrame.style.setProperty('width', window.innerWidth + "px", "important");
            iFrame.style.setProperty('height', window.innerHeight + "px", "important");
        }

        function changeIFrameSize(iFrame, w, h) {
            if (w != undefined)
                iFrame.style.setProperty('width', w, "important");
            if (h != undefined)
                iFrame.style.setProperty('height', h, "important");
        }

        function show(el) {
            el.style.visibility = 'visible';
        }

        function hide(el) {
            el.style.visibility = 'hidden';
        }

        function postMessageFunc(wind, param) {
            wind.postMessage(param, '*');
        }

        function resizeAllIFrames() {
            if (iFrameTrigger && iFrameTrigger.contentWindow) {
                postMessageFunc(iFrameTrigger.contentWindow, {
                    dataType: 'resize',
                    parentWidth: window.innerWidth,
                    parentHeight: window.innerHeight
                });
            }

            if ((dataWidgetSerankingSettings && dataWidgetSerankingSettings.type == 'popup') || (dataWidgetSerankingSettings && dataWidgetSerankingSettings.type == 'push')) {
                iFrameForm.style.setProperty('width', window.innerWidth + "px", "important");
                iFrameForm.style.setProperty('height', window.innerHeight + "px", "important");
            } else {
                if (iFrameForm) {
                    postMessageFunc(iFrameForm.contentWindow, {
                        dataType: 'resize',
                        parentWidth: window.innerWidth,
                        parentHeight: window.innerHeight
                    });
                }
                
            }
        }

        function startPositionForButton() {
            if (dataWidgetSerankingSettings.type == 'button') {
                iFrameTrigger.style[dataWidgetSerankingSettings.position.split('_')[0]] = 0;
                iFrameTrigger.style[dataWidgetSerankingSettings.position.split('_')[1]] = '30px';
            }
        }

        function removeAll() {
            if (iFrameTrigger.contentWindowf) {
                iFrameTrigger.parentNode.removeChild(iFrameTrigger);
            }

            iFrameForm.parentNode.removeChild(iFrameForm);
            if (scriptBlock) {
                scriptBlock.parentNode.removeChild(scriptBlock);
            }

            // hide widget and add cookie for year
            if (dataWidgetSerankingSettings.allow) {
                var curDate = new Date();
                curDate.setYear(+curDate.getFullYear()+1);

                setCookie(cookieNameHideWidget, 1, {
                    path: '/',
                    expires: curDate
                });
            }
        }

        window.onresize = function() {
            resizeAllIFrames();
        };


        function insertAfter(elem, refElem) {
            if (!refElem.closest('body')) {
                var bodyElement = document.querySelector('body');
                bodyElement.insertBefore(elem, bodyElement.firstChild);
            } else {
                refElem.parentNode.insertBefore(elem, refElem.nextSibling);
            }
        }
        // COOKIE

        function getCookie(name) {
          var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
          ));
          return matches ? decodeURIComponent(matches[1]) : undefined;
        }

        function setCookie(name, value, options) {
          options = options || {};

          var expires = options.expires;

          if (typeof expires == "number" && expires) {
            var d = new Date();
            d.setTime(d.getTime() + expires * 1000);
            expires = options.expires = d;
          }
          if (expires && expires.toUTCString) {
            options.expires = expires.toUTCString();
          }

          value = encodeURIComponent(value);

          var updatedCookie = name + "=" + value;

          for (var propName in options) {
            updatedCookie += "; " + propName;
            var propValue = options[propName];
            if (propValue !== true) {
              updatedCookie += "=" + propValue;
            }
          }

          document.cookie = updatedCookie;
        }
        // /COOKIE
    };
})();