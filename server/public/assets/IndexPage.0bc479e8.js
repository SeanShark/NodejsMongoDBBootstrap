import{u as y,b as _,c as V,Q as T,a as k}from"./QTabs.d2a785b3.js";import{c as E,aa as Q,ab as h,a as q,w as M,H as P,r as p,q as R,D as U,J as I,K as L,L as s,M as o,aq as S,P as n,aV as $,am as g,S as f,T as b,R as v,aW as C,Q as w}from"./index.07c9eebd.js";import{Q as B,a as D}from"./QTabPanels.65edf2a3.js";import{u as N}from"./store.dcb5d388.js";import"./QResizeObserver.46e1cd17.js";import"./rtl.b51694b1.js";import"./use-panel.c8491bd7.js";import"./axios.7331a07d.js";var j=E({name:"QRouteTab",props:{...Q,...y},emits:_,setup(u,{slots:l,emit:d}){const r=h({useDisableForRouterLinkProps:!1}),{renderTab:i,$tabs:m}=V(u,l,d,{exact:q(()=>u.exact),...r});return M(()=>`${u.name} | ${u.exact} | ${(r.resolvedLink.value||{}).href}`,()=>{m.verifyRouteModel()}),()=>i(r.linkTag.value,r.linkAttrs.value)}});const A={class:"row"},z={class:"q-gutter-y-sm"},F=n("div",{class:"text-h5 q-pb-md"},"\u767B \u5F55 \u9875",-1),H=n("img",{src:"/icons/img_avatar.png"},null,-1),J={class:"q-pt-sm"},K={class:"q-mb-md"},W={class:"q-my-md row justify-between"},G={class:"q-py-md"},oe={__name:"IndexPage",setup(u){const l=N(),d=P(),r=p("login"),i=p(!0),m=p(!1);R(async()=>{localStorage.getItem("token")!==null&&(await l.verifyUser(),l.user&&d.push("/"))});const e=U({email:"",password:"",remember:!1,pwdError:!1,nameError:!1,errorMsg:""}),x=async()=>{e.nameError=!1,e.pwdError=!1;const c=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;if(e.email){if(!e.password)return e.pwdError=!0,e.errorMsg="\u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A"}else return e.nameError=!0,e.errorMsg="\u8BF7\u8F93\u5165\u7528\u6237\u540D";if(!c.test(e.email)){e.nameError=!0,e.errorMsg="\u975E\u6CD5\u90AE\u7BB1\u5730\u5740";return}m.value=!0,await l.axios.post("/user/login",e).then(async a=>{a.status===200&&(localStorage.setItem("token",a.data.token),await l.verifyUser().then(()=>{m.value=!1,l.successTip("\u6210\u529F\u767B\u5F55"),d.push("/")}).catch(t=>{console.log(t)}))}).catch(a=>{m.value=!1,a.response.data.status==="nameError"?(e.nameError=!0,e.errorMsg=a.response.data.msg):a.response.data.status==="pwdError"?(e.pwdError=!0,e.errorMsg=a.response.data.msg):l.store.failureTip(a.response.data.msg)})};return(c,a)=>(I(),L("div",A,[s(S,{class:"shadow-13 fixed-center q-pa-none col-xs-12 col-md-6",style:{"max-width":"550px"}},{default:o(()=>[s(T,{modelValue:r.value,"onUpdate:modelValue":a[0]||(a[0]=t=>r.value=t),align:"justify","narrow-indicator":"",class:"q-mb-md"},{default:o(()=>[s(k,{class:"text-primary",name:"login",label:" \u767B \u5F55 "}),s(j,{class:"text-orange",name:"register",label:" \u6CE8 \u518C ",to:"/register"})]),_:1},8,["modelValue"]),n("div",z,[s(B,{modelValue:r.value,"onUpdate:modelValue":a[5]||(a[5]=t=>r.value=t),animated:"","transition-prev":"fade","transition-next":"fade",class:"text-center q-ma-none q-pa-none"},{default:o(()=>[s(D,{class:"q-gutter-sm",name:"login"},{default:o(()=>[F,s($,{size:"120px",class:"shadow-3"},{default:o(()=>[H]),_:1}),n("div",J,[s(g,{modelValue:e.email,"onUpdate:modelValue":a[1]||(a[1]=t=>e.email=t),filled:"",type:"email",label:"\u90AE\u7BB1\u5730\u5740",class:"q-py-xs","bottom-slots":"","hide-bottom-space":"",error:e.nameError},{before:o(()=>[s(f,{color:"teal",name:"mail"})]),error:o(()=>[b(v(e.errorMsg),1)]),_:1},8,["modelValue","error"])]),n("div",K,[s(g,{modelValue:e.password,"onUpdate:modelValue":a[3]||(a[3]=t=>e.password=t),filled:"",type:i.value?"password":"text",label:"\u5BC6\u7801","bottom-slots":"","hide-bottom-space":"",error:e.pwdError},{before:o(()=>[s(f,{name:"lock"})]),append:o(()=>[s(f,{name:i.value?"visibility_off":"visibility",class:"cursor-pointer",onClick:a[2]||(a[2]=t=>i.value=!i.value)},null,8,["name"])]),error:o(()=>[b(v(e.errorMsg),1)]),_:1},8,["modelValue","type","error"])]),n("div",W,[s(C,{modelValue:e.remember,"onUpdate:modelValue":a[4]||(a[4]=t=>e.remember=t),class:"left",label:"\u8BB0\u4F4F\u6211"},null,8,["modelValue"]),s(w,{flat:"",color:"indigo-7",label:"\u5FD8\u8BB0\u5BC6\u7801\uFF1F",to:"/forgot",class:"text-italic"})]),n("div",G,[s(w,{color:"primary",class:"full-width","icon-right":"login",label:"\u767B \u5F55",loading:m.value,onClick:x},null,8,["loading"])])]),_:1})]),_:1},8,["modelValue"])])]),_:1})]))}};export{oe as default};
