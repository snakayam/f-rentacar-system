import React, { useState } from 'react'

/* ========== Sample Data ========== */
const vehicles = [
  { id:'V001',name:'アクア',plate:'品川 500 あ 1234',type:'コンパクト',status:'責出可',rate:5500,km:32150,icon:'🚗' },
  { id:'V002',name:'プリウス',plate:'品川 500 い 5678',type:'セダン',status:'責出中',rate:7000,km:45200,icon:'🚙' },
  { id:'V003',name:'ヤリスクロス',plate:'品川 300 う 9012',type:'SUV',status:'責出可',rate:8000,km:18500,icon:'🚙' },
  { id:'V004',name:'ノア',plate:'品川 500 え 3456',type:'ミニバン',status:'整備中',rate:9500,km:55800,icon:'🚐' },
  { id:'V005',name:'ハイエース',plate:'品川 100 お 7890',type:'バン',status:'責出中',rate:12000,km:78900,icon:'🚐' },
  { id:'V006',name:'カローラ',plate:'品川 500 か 2345',type:'セダン',status:'責出可',rate:6500,km:28700,icon:'🚗' },
  { id:'V007',name:'シエンタ',plate:'品川 500 き 6789',type:'コンパクトミニバン',status:'責出可',rate:7500,km:21300,icon:'🚙' },
  { id:'V008',name:'ハリアー',plate:'品川 300 く 1357',type:'SUV',status:'責出中',rate:11000,km:15400,icon:'🚙' },
]

const reservations0 = [
  { id:'R001',cName:'田中太郎',vName:'プリウス',start:'2026-04-20',end:'2026-04-25',status:'責出中',amount:35000,ins:'フル' },
  { id:'R002',cName:'佐藤花子',vName:'ハイエース',start:'2026-04-22',end:'2026-04-28',status:'責出中',amount:72000,ins:'スタンダード' },
  { id:'R003',cName:'鈴木一郎',vName:'ハリアー',start:'2026-04-23',end:'2026-04-26',status:'責出中',amount:33000,ins:'フル' },
  { id:'R004',cName:'高橋美咲',vName:'アクア',start:'2026-04-25',end:'2026-04-27',status:'予約確定',amount:11000,ins:'なし' },
  { id:'R005',cName:'渡辺健',vName:'ヤリスクロス',start:'2026-04-26',end:'2026-04-30',status:'予約確定',amount:32000,ins:'スタンダード' },
]

const customers0 = [
  { id:'C001',name:'田中太郎',phone:'090-1234-5678',email:'tanaka@example.com',rentals:8,since:'2024-03-15',note:'常連客' },
  { id:'C002',name:'佐藤花子',phone:'090-2345-6789',email:'sato@example.com',rentals:3,since:'2025-01-20',note:'' },
  { id:'C003',name:'鈴木一郎',phone:'080-3456-7890',email:'suzuki@example.com',rentals:12,since:'2023-06-10',note:'VIP' },
  { id:'C004',name:'高橋美咲',phone:'070-4567-8901',email:'takahashi@example.com',rentals:1,since:'2026-04-01',note:'新規' },
  { id:'C005',name:'渡辺健',phone:'090-5678-9012',email:'watanabe@example.com',rentals:5,since:'2024-11-30',note:'' },
]

/* ========== Styles ========== */
const S = {
  app: { display:'flex',minHeight:'100vh' },
  sidebar: { position:'fixed',left:0,top:0,bottom:0,width:240,background:'#111827',color:'#fff',display:'flex',flexDirection:'column',zIndex:20 },
  sidebarHeader: { padding:'1.25rem',borderBottom:'1px solid #374151' },
  logo: { display:'inline-flex',alignItems:'center',justifyContent:'center',width:32,height:32,background:'#1a56db',borderRadius:8,fontWeight:800,marginRight:8 },
  navItem: { display:'flex',alignItems:'center',gap:12,width:'100%',padding:'0.75rem 1rem',borderRadius:8,color:'#d1d5db',fontSize:'.875rem',fontWeight:500,border:'none',background:'none',cursor:'pointer',textAlign:'left' },
  navActive: { background:'#1a56db',color:'#fff' },
  main: { flex:1,marginLeft:240 },
  topBar: { display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.75rem 1.5rem',background:'#fff',borderBottom:'1px solid #e5e7eb',position:'sticky',top:0,zIndex:10 },
  page: { padding:'1.5rem' },
  statsGrid: { display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'1.5rem' },
  statCard: { display:'flex',alignItems:'center',gap:'1rem',padding:'1.25rem',background:'#fff',borderRadius:8,border:'1px solid #e5e7eb',cursor:'pointer' },
  statIcon: { fontSize:'1.5rem',width:48,height:48,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:12 },
  statVal: { fontSize:'1.5rem',fontWeight:700,lineHeight:1.2 },
  statLabel: { fontSize:'.75rem',color:'#6b7280' },
  card: { background:'#fff',borderRadius:8,border:'1px solid #e5e7eb',overflow:'hidden' },
  cardHeader: { display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem 1.25rem',borderBottom:'1px solid #e5e7eb' },
  cardBody: { padding:'1rem 1.25rem',overflowX:'auto' },
  th: { padding:'.625rem .75rem',textAlign:'left',fontSize:'.75rem',fontWeight:600,color:'#6b7280',background:'#f9fafb',borderBottom:'1px solid #f3f4f6',textTransform:'uppercase',letterSpacing:'.025em' },
  td: { padding:'.625rem .75rem',textAlign:'left',fontSize:'.8125rem',borderBottom:'1px solid #f3f4f6' },
  badge: { display:'inline-flex',padding:'2px 8px',borderRadius:16,fontSize:'.6875rem',fontWeight:600,whiteSpace:'nowrap' },
  btn: { display:'inline-flex',alignItems:'center',justifyContent:'center',gap:6,padding:'.5rem 1rem',borderRadius:6,fontSize:'.875rem',fontWeight:500,border:'none',cursor:'pointer' },
  btnPrimary: { background:'#1a56db',color:'#fff' },
  btnSuccess: { background:'#059669',color:'#fff' },
  btnWarning: { background:'#d97706',color:'#fff' },
  btnDanger: { background:'#dc2626',color:'#fff' },
  btnOutline: { border:'1px solid #d1d5db',color:'#374151',background:'#fff' },
  btnSm: { padding:'.25rem .5rem',fontSize:'.75rem' },
  modal: { position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:50,padding:'1rem' },
  modalBox: { background:'#fff',borderRadius:12,width:'100%',maxWidth:560,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 20px 60px rgba(0,0,0,0.15)' },
  modalHeader: { display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem 1.25rem',borderBottom:'1px solid #e5e7eb' },
  modalBody: { padding:'1.25rem' },
  modalFooter: { display:'flex',justifyContent:'flex-end',gap:12,padding:'1rem 1.25rem',borderTop:'1px solid #e5e7eb' },
  formGrid: { display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem' },
  formGroup: { display:'flex',flexDirection:'column',gap:6 },
  label: { fontSize:'.75rem',fontWeight:600,color:'#4b5563' },
  input: { padding:'.5rem .75rem',border:'1px solid #d1d5db',borderRadius:6,fontSize:'.875rem' },
  vGrid: { display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'1rem' },
  vCard: { background:'#fff',border:'1px solid #e5e7eb',borderRadius:8,padding:'1.25rem' },
  actions: { display:'flex',gap:6,flexWrap:'wrap',paddingTop:12,borderTop:'1px solid #f3f4f6' },
  filters: { display:'flex',gap:12,flexWrap:'wrap' },
  pageActions: { display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem',gap:'1rem',flexWrap:'wrap' },
  returnCard: { background:'#fff',border:'1px solid #e5e7eb',borderRadius:8,padding:'1.25rem' },
  totalRow: { display:'flex',justifyContent:'space-between',fontSize:'.8125rem',marginBottom:4 },
  totalFinal: { fontSize:'1.125rem',fontWeight:700,paddingTop:8,borderTop:'2px solid #1f2937',marginTop:4,color:'#1a56db' },
}

const badgeColor = (s) => {
  if(s==='責出中'||s==='責出可') return s==='責出中'?{background:'#e1effe',color:'#1a56db'}:{background:'#d1fae5',color:'#059669'}
  if(s==='予約確定') return {background:'#d1fae5',color:'#059669'}
  if(s==='仮予約') return {background:'#fef3c7',color:'#d97706'}
  if(s==='整備中') return {background:'#fef3c7',color:'#d97706'}
  if(s==='返却済') return {background:'#f3f4f6',color:'#6b7280'}
  if(s==='キャンセル') return {background:'#fee2e2',color:'#dc2626'}
  return {}
}

/* ========== Menu Items ========== */
const menu = [
  {id:'dashboard',label:'ダッシュボード',icon:'📊'},
  {id:'vehicles',label:'車両管理',icon:'🚗'},
  {id:'reservations',label:'予約管理',icon:'📅'},
  {id:'customers',label:'顧客管理',icon:'👤'},
  {id:'returns',label:'返却・精算',icon:'💰'},
]
const pageTitle = {dashboard:'ダッシュボード',vehicles:'車両管理',reservations:'予約管理',customers:'顧客管理',returns:'返却・精算'}

/* ========== Dashboard ========== */
function Dashboard({vehicles:v,reservations:r,onNav}){
  const avail=v.filter(x=>x.status==='責出可').length
  const rented=v.filter(x=>x.status==='責出中').length
  const maint=v.filter(x=>x.status==='整備中').length
  const rev=r.filter(x=>x.status==='責出中').reduce((s,x)=>s+x.amount,0)
  return <div>
    <div style={S.statsGrid}>
      <div style={S.statCard} onClick={()=>onNav('vehicles')}>
        <div style={{...S.statIcon,background:'#e1effe'}}>🚗</div>
        <div><div style={S.statVal}>{avail}</div><div style={S.statLabel}>責出可能車両</div></div>
      </div>
      <div style={S.statCard} onClick={()=>onNav('reservations')}>
        <div style={{...S.statIcon,background:'#d1fae5'}}>📅</div>
        <div><div style={S.statVal}>{rented}</div><div style={S.statLabel}>責出中</div></div>
      </div>
      <div style={S.statCard}>
        <div style={{...S.statIcon,background:'#fef3c7'}}>🔧</div>
        <div><div style={S.statVal}>{maint}</div><div style={S.statLabel}>整備中</div></div>
      </div>
      <div style={S.statCard}>
        <div style={{...S.statIcon,background:'#ede9fe'}}>💴</div>
        <div><div style={S.statVal}>¥{rev.toLocaleString()}</div><div style={S.statLabel}>現在の売上</div></div>
      </div>
    </div>
    <div style={S.card}>
      <div style={S.cardHeader}><h3 style={{fontSize:'.9375rem',fontWeight:600}}>予約一覧</h3></div>
      <div style={S.cardBody}>
        <table><thead><tr>
          <th style={S.th}>予約ID</th><th style={S.th}>顧客名</th><th style={S.th}>車両</th><th style={S.th}>期間</th><th style={S.th}>ステータス</th>
        </tr></thead><tbody>
          {r.map(x=><tr key={x.id}>
            <td style={S.td}>{x.id}</td><td style={S.td}>{x.cName}</td><td style={S.td}>{x.vName}</td>
            <td style={{...S.td,fontSize:'.75rem',color:'#6b7280'}}>{x.start} 〜 {x.end}</td>
            <td style={S.td}><span style={{...S.badge,...badgeColor(x.status)}}>{x.status}</span></td>
          </tr>)}
        </tbody></table>
      </div>
    </div>
  </div>
}

/* ========== Vehicles ========== */
function Vehicles({vehicles:initV}){
  const [vList,setVList]=useState(initV)
  const [filter,setFilter]=useState('all')
  const [search,setSearch]=useState('')
  const filtered=vList.filter(v=>{
    const mf=filter==='all'||v.status===filter
    const ms=v.name.includes(search)||v.plate.includes(search)
    return mf&&ms
  })
  const changeStatus=(id,s)=>setVList(p=>p.map(v=>v.id===id?{...v,status:s}:v))
  return <div>
    <div style={S.pageActions}>
      <div style={S.filters}>
        <input style={{...S.input,minWidth:280}} placeholder="車両名・ナンバーで検索..." value={search} onChange={e=>setSearch(e.target.value)}/>
        <select style={S.input} value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="all">すべて</option>
          <option value="責出可">責出可</option>
          <option value="責出中">責出中</option>
          <option value="整備中">整備中</option>
        </select>
      </div>
    </div>
    <div style={S.vGrid}>
      {filtered.map(v=><div key={v.id} style={S.vCard}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <span style={{fontSize:'2rem'}}>{v.icon}</span>
          <span style={{...S.badge,...badgeColor(v.status)}}>{v.status}</span>
        </div>
        <h3 style={{fontSize:'1rem',fontWeight:600,marginBottom:4}}>{v.name}</h3>
        <p style={{fontSize:'.75rem',color:'#6b7280',fontFamily:'monospace',marginBottom:16}}>{v.plate}</p>
        <div style={{marginBottom:16}}>
          {[['タイプ',v.type],['日額','¥'+v.rate.toLocaleString()],['走行距離',v.km.toLocaleString()+'km']].map(([l,val])=>
            <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'4px 0',fontSize:'.8125rem'}}>
              <span style={{color:'#6b7280'}}>{l}</span><span style={{fontWeight:500}}>{val}</span>
            </div>
          )}
        </div>
        <div style={S.actions}>
          {v.status==='責出可'&&<button style={{...S.btn,...S.btnPrimary,...S.btnSm}} onClick={()=>changeStatus(v.id,'責出中')}>責出開始</button>}
          {v.status==='責出中'&&<button style={{...S.btn,...S.btnSuccess,...S.btnSm}} onClick={()=>changeStatus(v.id,'責出可')}>返却処理</button>}
          {v.status!=='整備中'&&<button style={{...S.btn,...S.btnWarning,...S.btnSm}} onClick={()=>changeStatus(v.id,'整備中')}>整備開始</button>}
          {v.status==='整備中'&&<button style={{...S.btn,...S.btnSuccess,...S.btnSm}} onClick={()=>changeStatus(v.id,'責出可')}>整備完了</button>}
        </div>
      </div>)}
    </div>
  </div>
}

/* ========== Reservations ========== */
function Reservations({reservations:initR}){
  const [rList,setRList]=useState(initR)
  const [filter,setFilter]=useState('all')
  const filtered=rList.filter(r=>filter==='all'||r.status===filter)
  const changeS=(id,s)=>setRList(p=>p.map(r=>r.id===id?{...r,status:s}:r))
  return <div>
    <div style={S.pageActions}>
      <select style={S.input} value={filter} onChange={e=>setFilter(e.target.value)}>
        <option value="all">すべて</option>
        <option value="仮予約">仮予約</option>
        <option value="予約確定">予約確定</option>
        <option value="責出中">責出中</option>
        <option value="返却済">返却済</option>
      </select>
    </div>
    <div style={S.card}><div style={S.cardBody}>
      <table><thead><tr>
        <th style={S.th}>ID</th><th style={S.th}>顧客</th><th style={S.th}>車両</th>
        <th style={S.th}>責出日</th><th style={S.th}>返却日</th>
        <th style={S.th}>保険</th><th style={S.th}>金額</th><th style={S.th}>ステータス</th><th style={S.th}>操作</th>
      </tr></thead><tbody>
        {filtered.map(r=><tr key={r.id}>
          <td style={S.td}>{r.id}</td><td style={S.td}>{r.cName}</td><td style={S.td}>{r.vName}</td>
          <td style={S.td}>{r.start}</td><td style={S.td}>{r.end}</td>
          <td style={S.td}><span style={{...S.badge,border:'1px solid #d1d5db',color:'#4b5563'}}>{r.ins}</span></td>
          <td style={{...S.td,textAlign:'right'}}>¥{r.amount.toLocaleString()}</td>
          <td style={S.td}><span style={{...S.badge,...badgeColor(r.status)}}>{r.status}</span></td>
          <td style={S.td}><div style={{display:'flex',gap:4}}>
            {r.status==='仮予約'&&<button style={{...S.btn,...S.btnSuccess,...S.btnSm}} onClick={()=>changeS(r.id,'予約確定')}>確定</button>}
            {r.status==='予約確定'&&<button style={{...S.btn,...S.btnPrimary,...S.btnSm}} onClick={()=>changeS(r.id,'責出中')}>責出</button>}
            {r.status==='責出中'&&<button style={{...S.btn,...S.btnSuccess,...S.btnSm}} onClick={()=>changeS(r.id,'返却済')}>返却</button>}
            {(r.status==='仮予約'||r.status==='予約確定')&&<button style={{...S.btn,...S.btnDanger,...S.btnSm}} onClick={()=>changeS(r.id,'キャンセル')}>取消</button>}
          </div></td>
        </tr>)}
      </tbody></table>
    </div></div>
  </div>
}

/* ========== Customers ========== */
function Customers({customers:initC}){
  const [cList]=useState(initC)
  const [search,setSearch]=useState('')
  const filtered=cList.filter(c=>c.name.includes(search)||c.phone.includes(search)||c.email.includes(search))
  return <div>
    <div style={S.pageActions}>
      <input style={{...S.input,minWidth:280}} placeholder="名前・電話番号で検索..." value={search} onChange={e=>setSearch(e.target.value)}/>
    </div>
    <div style={S.card}><div style={S.cardBody}>
      <table><thead><tr>
        <th style={S.th}>ID</th><th style={S.th}>氏名</th><th style={S.th}>電話</th>
        <th style={S.th}>メール</th><th style={S.th}>利用回数</th><th style={S.th}>登録日</th><th style={S.th}>備考</th>
      </tr></thead><tbody>
        {filtered.map(c=><tr key={c.id}>
          <td style={S.td}>{c.id}</td><td style={{...S.td,fontWeight:500,color:'#1a56db'}}>{c.name}</td>
          <td style={S.td}>{c.phone}</td><td style={{...S.td,fontSize:'.75rem',color:'#6b7280'}}>{c.email}</td>
          <td style={{...S.td,textAlign:'center'}}>{c.rentals}回</td><td style={S.td}>{c.since}</td>
          <td style={S.td}>{c.note&&<span style={{...S.badge,border:'1px solid #d1d5db',color:'#4b5563'}}>{c.note}</span>}</td>
        </tr>)}
      </tbody></table>
    </div></div>
  </div>
}

/* ========== Returns ========== */
function Returns({reservations:initR}){
  const [rList,setRList]=useState(initR)
  const [selected,setSelected]=useState(null)
  const active=rList.filter(r=>r.status==='責出中')
  const done=rList.filter(r=>r.status==='返却済')
  const processReturn=(data)=>{setRList(p=>p.map(r=>r.id===data.id?{...r,status:'返却済',finalAmt:data.total}:r));setSelected(null)}
  return <div>
    <h3 style={{fontSize:'1rem',fontWeight:600,marginBottom:'1rem',color:'#374151'}}>返却待ち一覧</h3>
    {active.length===0?<div style={{textAlign:'center',padding:'3rem',color:'#9ca3af'}}>現在返却待ちの責出はありません</div>:
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'1rem',marginBottom:'2rem'}}>
      {active.map(r=>{
        const days=Math.ceil((new Date(r.end)-new Date())/(864e5))
        const over=days<0
        return <div key={r.id} style={{...S.returnCard,...(over?{borderColor:'#dc2626',background:'#fff5f5'}:{})}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'1rem'}}>
            <div><h4 style={{fontSize:'1rem',fontWeight:600}}>{r.vName}</h4><p style={{fontSize:'.8125rem',color:'#6b7280'}}>{r.cName}</p></div>
            <span style={{...S.badge,...(over?{background:'#fee2e2',color:'#dc2626'}:days<=1?{background:'#fef3c7',color:'#d97706'}:{background:'#e1effe',color:'#1a56db'})}}>{over?'超過 '+Math.abs(days)+'日':days<=1?'本日返却':'残り '+days+'日'}</span>
          </div>
          {[['責出日',r.start],['返却予定日',r.end],['基本料金','¥'+r.amount.toLocaleString()]].map(([l,v])=>
            <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'4px 0',fontSize:'.8125rem'}}><span>{l}</span><span>{v}</span></div>
          )}
          <button style={{...S.btn,...S.btnPrimary,width:'100%',marginTop:12}} onClick={()=>setSelected(r)}>返却処理を開始</button>
        </div>
      })}
    </div>}
    {selected&&<ReturnModal r={selected} onClose={()=>setSelected(null)} onProcess={processReturn}/>}
    {done.length>0&&<>
      <h3 style={{fontSize:'1rem',fontWeight:600,marginBottom:'1rem',marginTop:'2rem',color:'#374151'}}>返却済み</h3>
      <div style={S.card}><div style={S.cardBody}>
        <table><thead><tr><th style={S.th}>ID</th><th style={S.th}>顧客</th><th style={S.th}>車両</th><th style={S.th}>期間</th><th style={S.th}>金額</th></tr></thead>
        <tbody>{done.map(r=><tr key={r.id}><td style={S.td}>{r.id}</td><td style={S.td}>{r.cName}</td><td style={S.td}>{r.vName}</td><td style={{...S.td,fontSize:'.75rem',color:'#6b7280'}}>{r.start} 〜 {r.end}</td><td style={{...S.td,textAlign:'right'}}>¥{(r.finalAmt||r.amount).toLocaleString()}</td></tr>)}</tbody></table>
      </div></div>
    </>}
  </div>
}

function ReturnModal({r,onClose,onProcess}){
  const [fuel,setFuel]=useState(0)
  const [extra,setExtra]=useState(0)
  const overDays=Math.max(0,Math.ceil((new Date()-new Date(r.end))/864e5))
  const overCharge=overDays*3000
  const total=r.amount+fuel+extra+overCharge
  return <div style={S.modal} onClick={onClose}>
    <div style={S.modalBox} onClick={e=>e.stopPropagation()}>
      <div style={S.modalHeader}><h3 style={{fontSize:'1rem',fontWeight:600}}>返却精算 - {r.vName}</h3><button onClick={onClose}>✕</button></div>
      <div style={S.modalBody}>
        <div style={{background:'#f9fafb',borderRadius:8,padding:'1rem',marginBottom:'1.25rem'}}>
          {[['顧客',r.cName],['車両',r.vName],['責出日',r.start],['返却予定',r.end],['保険',r.ins]].map(([l,v])=>
            <div key={l} style={{display:'flex',justifyContent:'space-between',fontSize:'.8125rem',marginBottom:4}}><span style={{color:'#6b7280'}}>{l}</span><span>{v}</span></div>
          )}
        </div>
        <div style={S.formGrid}>
          <div style={S.formGroup}><label style={S.label}>燃料補充代(円)</label><input style={S.input} type="number" value={fuel} onChange={e=>setFuel(+e.target.value)}/></div>
          <div style={S.formGroup}><label style={S.label}>追加料金(円)</label><input style={S.input} type="number" value={extra} onChange={e=>setExtra(+e.target.value)}/></div>
        </div>
        <div style={{marginTop:'1.25rem',paddingTop:'1rem',borderTop:'1px solid #e5e7eb'}}>
          <div style={S.totalRow}><span>基本料金</span><span>¥{r.amount.toLocaleString()}</span></div>
          {overCharge>0&&<div style={{...S.totalRow,color:'#dc2626'}}><span>超過({overDays}日×¥3,000)</span><span>¥{overCharge.toLocaleString()}</span></div>}
          {fuel>0&&<div style={S.totalRow}><span>燃料代</span><span>¥{fuel.toLocaleString()}</span></div>}
          {extra>0&&<div style={S.totalRow}><span>追加料金</span><span>¥{extra.toLocaleString()}</span></div>}
          <div style={S.totalFinal}><span>精算合計</span><span>¥{total.toLocaleString()}</span></div>
        </div>
      </div>
      <div style={S.modalFooter}>
        <button style={{...S.btn,...S.btnOutline}} onClick={onClose}>キャンセル</button>
        <button style={{...S.btn,...S.btnPrimary}} onClick={()=>onProcess({...r,total})}>精算完了</button>
      </div>
    </div>
  </div>
}

/* ========== Main App ========== */
export default function App(){
  const [page,setPage]=useState('dashboard')
  return <div style={S.app}>
    <aside style={S.sidebar}>
      <div style={S.sidebarHeader}>
        <div style={{display:'flex',alignItems:'center',fontSize:'1.125rem',fontWeight:700}}>
          <span style={S.logo}>F</span>レンタカー
        </div>
      </div>
      <nav style={{flex:1,padding:8}}>
        {menu.map(m=><button key={m.id} style={{...S.navItem,...(page===m.id?S.navActive:{})}} onClick={()=>setPage(m.id)}>
          <span style={{fontSize:'1.125rem'}}>{m.icon}</span>{m.label}
        </button>)}
      </nav>
      <div style={{padding:'1rem',borderTop:'1px solid #374151',color:'#6b7280',textAlign:'center'}}>
        <small>Fレンタカー業務管理 v1.0</small>
      </div>
    </aside>
    <main style={S.main}>
      <header style={S.topBar}>
        <h1 style={{fontSize:'1.125rem',fontWeight:600}}>{pageTitle[page]}</h1>
        <div style={{display:'flex',alignItems:'center',gap:'1rem',fontSize:'.875rem',color:'#6b7280'}}>
          <span>{new Date().toLocaleDateString('ja-JP')}</span>
          <span style={{padding:'4px 12px',background:'#e1effe',color:'#1a56db',borderRadius:16,fontWeight:500}}>管理者</span>
        </div>
      </header>
      <div style={S.page}>
        {page==='dashboard'&&<Dashboard vehicles={vehicles} reservations={reservations0} onNav={setPage}/>}
        {page==='vehicles'&&<Vehicles vehicles={vehicles}/>}
        {page==='reservations'&&<Reservations reservations={reservations0}/>}
        {page==='customers'&&<Customers customers={customers0}/>}
        {page==='returns'&&<Returns reservations={reservations0}/>}
      </div>
    </main>
  </div>
}
