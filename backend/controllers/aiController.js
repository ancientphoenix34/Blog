const { Readable } = require('stream');
const HttpError = require('../models/errorModel');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

const forwardAiError = async (response, next) => {
  const body = await response.json().catch(() => ({}));
  const message = body.detail || 'AI service error';
  return next(new HttpError(message, response.status));
};

const suggestTitleAndCategory = async (req, res, next) => {
  const { excerpt } = req.body;
  if (!excerpt) return next(new HttpError('Excerpt is required', 422));
  try {
    const response = await fetch(`${AI_SERVICE_URL}/suggest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ excerpt }),
    });
    if (!response.ok) return forwardAiError(response, next);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    return next(new HttpError('AI service unreachable', 503));
  }
};

const summarizePost = async (req, res, next) => {
  const { excerpt } = req.body;
  if (!excerpt) return next(new HttpError('Excerpt is required', 422));

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  try {
    const aiResponse = await fetch(`${AI_SERVICE_URL}/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ excerpt }),
    });
    if (!aiResponse.ok) {
      res.write('data: [ERROR]\n\n');
      return res.end();
    }
    const nodeStream = Readable.fromWeb(aiResponse.body);
    nodeStream.pipe(res);
    req.on('close', () => nodeStream.destroy());
  } catch (err) {
    res.write('data: [ERROR]\n\n');
    res.end();
  }
};

const analyzeTone = async (req, res, next) => {
  const { excerpt } = req.body;
  if (!excerpt) return next(new HttpError('Excerpt is required', 422));
  try {
    const response = await fetch(`${AI_SERVICE_URL}/analyze-tone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ excerpt }),
    });
    if (!response.ok) return forwardAiError(response, next);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    return next(new HttpError('AI service unreachable', 503));
  }
};

module.exports = { suggestTitleAndCategory, summarizePost, analyzeTone };
