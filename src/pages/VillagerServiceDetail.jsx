import React, { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Icon from '../components/Icon';
import { useFeedback } from '../components/Feedback';
import { createVillagerId, readVillagerData, updateVillagerData } from '../data/villagerStorage';
import './VillagerHome.css';

const emptyForms = {
  subsidy: { name: '', phone: '', idCard: '', address: '', note: '' },
  job: { name: '', phone: '', skills: '', experience: '', note: '' }
};

const configMap = {
  subsidy: { list: 'subsidies', applications: 'subsidyApplications', idKey: 'subsidyId', back: '/villager/subsidy', label: '补贴政策', icon: 'subsidy' },
  job: { list: 'jobs', applications: 'jobApplications', idKey: 'jobId', back: '/villager/job', label: '就业岗位', icon: 'job' }
};

const VillagerServiceDetail = () => {
  const { type, id } = useParams();
  const config = configMap[type];
  const [data, setData] = useState(readVillagerData);
  const [form, setForm] = useState(emptyForms[type] || {});
  const [formOpen, setFormOpen] = useState(false);
  const { notify } = useFeedback();

  if (!config) return <Navigate to="/home" replace />;
  const item = data[config.list].find((entry) => String(entry.id) === String(id));
  if (!item) return <Navigate to={config.back} replace />;
  const application = data[config.applications].find((entry) => String(entry[config.idKey]) === String(item.id));

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || (type === 'subsidy' ? !form.idCard.trim() : !form.skills.trim())) return notify('请完整填写必填信息');
    const phone = form.phone.replace(/\D/g, '');
    if (!/^1[3-9]\d{9}$/.test(phone)) return notify('请输入正确的手机号');
    if (type === 'subsidy' && !/^\d{17}[\dXx]$/.test(form.idCard.trim())) return notify('请输入正确的身份证号');
    const record = {
      id: createVillagerId(type === 'subsidy' ? 'subsidy-apply' : 'job-apply'),
      [config.idKey]: item.id,
      title: item.title,
      applicant: { ...form, phone },
      status: '已提交',
      createdAt: new Date().toISOString()
    };
    const next = updateVillagerData((current) => ({ ...current, [config.applications]: [record, ...current[config.applications]] }));
    setData(next);
    setFormOpen(false);
    notify(type === 'subsidy' ? '补贴申请已提交' : '岗位申请已提交');
  };

  const withdraw = () => {
    const next = updateVillagerData((current) => ({ ...current, [config.applications]: current[config.applications].filter((entry) => entry.id !== application.id) }));
    setData(next);
    notify('申请已撤回');
  };

  return <div className="travel-page villager-page villager-service-detail">
    <header className="villager-detail-topbar"><Link to={config.back}>返回{config.label}</Link><span>{config.label}</span></header>
    <main className="villager-service-detail-main">
      <section className="villager-service-detail-card">
        <div className="villager-service-detail-icon"><Icon name={config.icon} size={28} /></div>
        <span>{type === 'subsidy' ? `申报截止 ${item.deadline}` : `${item.company} · ${item.location}`}</span>
        <h1>{item.title}</h1>
        {type === 'subsidy' ? <>
          <dl><div><dt>补贴标准</dt><dd>{item.amount}</dd></div><div><dt>适用对象</dt><dd>{item.audience}</dd></div><div><dt>材料清单</dt><dd>{item.materials}</dd></div></dl>
        </> : <>
          <dl><div><dt>薪资待遇</dt><dd>{item.salary}</dd></div><div><dt>招聘人数</dt><dd>{item.headcount} 人</dd></div><div><dt>工作内容</dt><dd>{item.duty}</dd></div><div><dt>任职要求</dt><dd>{item.requirement}</dd></div></dl>
        </>}
      </section>

      {application ? <section className="villager-service-status-card"><div><span>我的申请</span><b>{application.status}</b></div><h2>申请已提交</h2><p>申请人：{application.applicant.name}</p><p>联系电话：{application.applicant.phone}</p><p>提交时间：{new Date(application.createdAt).toLocaleString('zh-CN')}</p>{application.status === '已提交' && <button type="button" onClick={withdraw}>撤回申请</button>}</section> : <section className="villager-service-action-card"><h2>{type === 'subsidy' ? '确认符合条件后再申请' : '查看岗位信息后再投递'}</h2><p>{type === 'subsidy' ? '请提前准备材料清单中的原件或复印件，提交后工作人员会联系核验。' : '提交前请确认工作地点、工作内容与个人情况相符。'}</p>{!formOpen && <button type="button" onClick={() => setFormOpen(true)}>{type === 'subsidy' ? '开始申请补贴' : '申请这个岗位'}</button>}</section>}

      {!application && formOpen && <form className="villager-detail-application-form" onSubmit={submit}><div className="villager-form-title"><div><span>申请信息</span><h2>填写个人资料</h2></div><button type="button" onClick={() => setFormOpen(false)}>取消</button></div><label>姓名<input value={form.name} onChange={(event) => updateField('name', event.target.value)} placeholder="请输入真实姓名" /></label><label>手机号<input type="tel" inputMode="numeric" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} placeholder="用于工作人员联系" /></label>{type === 'subsidy' ? <><label>身份证号<input value={form.idCard} onChange={(event) => updateField('idCard', event.target.value)} placeholder="用于申请资格核验" /></label><label>居住地址<input value={form.address} onChange={(event) => updateField('address', event.target.value)} placeholder="请填写所在村组" /></label><label>申请说明<textarea value={form.note} onChange={(event) => updateField('note', event.target.value)} placeholder="说明经营情况或申请理由" /></label></> : <><label>技能特长<input value={form.skills} onChange={(event) => updateField('skills', event.target.value)} placeholder="如驾驶、接待、电商运营" /></label><label>相关经历<textarea value={form.experience} onChange={(event) => updateField('experience', event.target.value)} placeholder="简要说明工作或实践经历" /></label><label>补充说明<textarea value={form.note} onChange={(event) => updateField('note', event.target.value)} placeholder="可到岗时间等信息" /></label></>}<button type="submit">确认提交申请</button></form>}
    </main>
  </div>;
};

export default VillagerServiceDetail;
