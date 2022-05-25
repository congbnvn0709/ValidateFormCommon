export const PATTERNS = {
  // Accept: chữ và số
  PATTERN_001: new RegExp('^[0-9a-zA-Z]*$'),

  // Accept: chữ, số và dấu gạch dưới
  PATTERN_002: new RegExp('^[0-9a-zA-Z_]*$'),

  // Accept: ít nhất một chữ hoặc số
  PATTERN_003: new RegExp('^(?=.*[0-9])|(?=.*[a-zA-Z][0-9a-zA-Z]+)$'),

  // Accept: chữ, số và dấu gạch dưới nhưng không chấp nhận chỉ có duy nhất số
  PATTERN_004: new RegExp('^(?=.*[a-zA-Z_])([0-9a-zA-Z_]+)$'),

  // Accept: dùng cho chặn nhập chỉ chấp nhận số nguyên dương
  PATTERN_005: new RegExp('[^0-9]'),

  // Accept: số nguyên dương và số nguyên âm
  PATTERN_006: new RegExp('^0|(-?[1-9]0*)+$'),

  // Accept: số nguyên dương và số nguyên âm nhưng không chấp nhận số 0
  PATTERN_007: new RegExp('^(-?[1-9]0*)+$'),

  // Accept: thời gian cách nhau bởi dấu hai chấm (:)
  PATTERN_008: new RegExp('(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)'),

  // Accept: khung thời gian cách nhau bởi dấu hai chấm (-)
  PATTERN_009: new RegExp('(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)-(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)'),

  // Accept: comment here...
  PATTERN_010: new RegExp(''),

  // Accept: comment here...
  PATTERN_011: new RegExp(''),

  // Accept: comment here...
  PATTERN_012: new RegExp(''),

  // Accept: comment here...
  PATTERN_013: new RegExp(''),

  // Accept: comment here...
  PATTERN_014: new RegExp(''),

  // Accept: comment here...
  PATTERN_015: new RegExp(''),
}
