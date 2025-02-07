
const parseIPv4 = (input: string): number[] => {
  const ip = input.split('.', 4);

  const o0 = parseInt(ip[0]);
  const o1 = parseInt(ip[1]);
  const o2 = parseInt(ip[2]);
  const o3 = parseInt(ip[3]);

  return [o0, o1, o2, o3];
};

const hex = (v: string): string => {
  const h = parseInt(v, 10).toString(16);
  return h.length === 2 ? h : '0' + h;
};

const parseIPv6 = (input: string): number[] => {
  const addr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let i;
  let parsed;
  let chunk;

  // ipv4 e.g. `::ffff:64.17.254.216`
  const ip =
    input.indexOf('.') > -1
      ? input.replace(/(\d+)\.(\d+)\.(\d+)\.(\d+)/, (match, a, b, c, d) => {
          return hex(a) + hex(b) + ':' + hex(c) + hex(d);
        })
      : input;

  const [left, right] = ip.split('::', 2);

  if (left) {
    parsed = left.split(':');
    for (i = 0; i < parsed.length; i++) {
      chunk = parseInt(parsed[i], 16);
      addr[i * 2] = chunk >> 8;
      addr[i * 2 + 1] = chunk & 0xff;
    }
  }

  if (right) {
    parsed = right.split(':');
    const offset = 16 - parsed.length * 2; // 2 bytes per chunk
    for (i = 0; i < parsed.length; i++) {
      chunk = parseInt(parsed[i], 16);
      addr[offset + i * 2] = chunk >> 8;
      addr[offset + (i * 2 + 1)] = chunk & 0xff;
    }
  }

  return addr;
};

const parse = (ip: string): number[] => {
  return ip.indexOf(':') === -1 ? parseIPv4(ip) : parseIPv6(ip);
};

const bitAt = (rawAddress: Buffer | number[], idx: number): number => {
  // 8 bits per octet in the buffer (>>3 is slightly faster than Math.floor(idx/8))
  const bufIdx = idx >> 3;

  // Offset within the octet (basically equivalent to 8  - (idx % 8))
  const bitIdx = 7 ^ (idx & 7);

  // Shift the offset rightwards by bitIdx bits and & it to grab the bit
  return (rawAddress[bufIdx] >>> bitIdx) & 1;
};

const validateIPv4 = (ip:string) => {
  const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Regex.test(ip);
};

const validateIPv6 = (ip:string) => {
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  return ipv6Regex.test(ip);
};

const validate = (ip:string) => {
  return validateIPv4(ip) || validateIPv6(ip);
};


export default {
  bitAt,
  parse,
  validate,
};
