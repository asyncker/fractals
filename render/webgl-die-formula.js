float tanh(float x) { float ex = exp(x); return (ex - 1.0 / ex) / (ex + 1.0 / ex); }
vec2 csin_slow(vec2 z) { return vec2(sin(z.x) * cosh(z.y), cos(z.x) * sinh(z.y)); }
vec2 ccos_slow(vec2 z) { return vec2(cos(z.x) * cosh(z.y), -sin(z.x) * sinh(z.y)); }
vec2 csinw(vec2 z, vec2 w) { return cpow(csin(z), w); }
vec2 ccosw(vec2 z, vec2 w) { return cpow(ccos(z), w); }
vec2 csinhw(vec2 z, vec2 w) { return cpow(csinh(z), w); }
vec2 ccoshw(vec2 z, vec2 w) { return cpow(ccosh(z), w); }
vec2 ctanw(vec2 z, vec2 w, vec2 s) { return cmul(cpow(csin(z), s), cpow(ccos(z), w)); } // ctos
vec2 ccotw(vec2 z, vec2 w, vec2 s) { return cmul(cpow(ccos(z), s), cpow(csin(z), w)); }
vec2 ctanhw(vec2 z, vec2 w, vec2 s) { return cmul(cpow(csinh(z), s), cpow(ccosh(z), w)); } // ctosh
vec2 ccothw(vec2 z, vec2 w, vec2 s) { return cmul(cpow(ccosh(z), s), cpow(csinh(z), w)); }
vec2 ccot(vec2 z) { return cinv(ctan(z)); }
vec2 ccomp_dim(vec2 z, vec2 w) { return cre(z) * cim(w) - cim(w) * cre(z); }
vec2 cgamma_div_digamma(vec2 z) { return cmul(cgamma(z), cinv(cdigamma(z))); }
vec2 cdigamma_div_gamma(vec2 z) { return cmul(cdigamma(z), cinv(cgamma(z))); }
vec2 czeta1(vec2 z) { return cmul(czeta(z), cinv(czeta_derv(z))); }
vec2 czeta2(vec2 z) { return cmul(czeta_derv(z), cinv(czeta(z))); }
vec2 czeta_left(vec2 z) { return cmul(cpow(vec2(2.0 * PI, 0.0), z - vec2(1.0, 0.0)) * 2.0, cmul(csin(z * PI * 0.5), cgamma(vec2(1.0, 0.0) - z))); }

vec4 bimul(vec4 z, vec4 w) { return bifromid(cmul(bitoid_left(z), bitoid_left(w)), cmul(bitoid_right(z), bitoid_right(w))); }
vec4 biarg_test(vec4 z) { vec2 u = cmul_i(bidiv(z.zw, z.xy)); vec2 arg = cmul_i(clog(bidiv(vec2(1.0, 0.0) - u, vec2(1.0, 0.0) + u))) * 0.5; return vec4(0.0, 0.0, arg.x, arg.y); }

//bicomplex gamma
vec4 bigamma_right(vec4 z) {
  vec4 w = z - vec4(1.0, 0.0, 0.0, 0.0);
  vec4 t = w + vec4(7.5, 0.0, 0.0, 0.0);
  vec4 x = vec4(0.99999999999980993, 0.0, 0.0, 0.0);
  x += 676.5203681218851 * biinv(w + vec4(1.0, 0.0, 0.0, 0.0));
  x -= 1259.1392167224028 * biinv(w + vec4(2.0, 0.0, 0.0, 0.0));
  x += 771.32342877765313 * biinv(w + vec4(3.0, 0.0, 0.0, 0.0));
  x -= 176.61502916214059 * biinv(w + vec4(4.0, 0.0, 0.0, 0.0));
  x += 12.507343278686905 * biinv(w + vec4(5.0, 0.0, 0.0, 0.0));
  x -= 0.13857109526572012 * biinv(w + vec4(6.0, 0.0, 0.0, 0.0));
  x += 9.9843695780195716e-6 * biinv(w + vec4(7.0, 0.0, 0.0, 0.0));
  x += 1.5056327351493116e-7 * biinv(w + vec4(8.0, 0.0, 0.0, 0.0));
  vec4 logterm = bimul(bilog(t), w + vec4(0.5, 0.0, 0.0, 0.0)) - t;
  return 2.50662827463 * bimul(x, biexp(logterm));
}
vec4 bigamma_left(vec4 z) { return PI * biinv(bimul(bisin(z * PI), bigamma_right(vec4(1.0, 0.0, 0.0, 0.0) - z))); }
vec4 bigamma(vec4 z) { return z.x < 0.5 ? bigamma_left(z) : bigamma_right(z); }

vec4 qsqrt(vec4 z) {
  float norm = length(z); float vlen = length(z.yzw);
  if (vlen < 1e-6) { return vec4(sqrt(max(0.0, z.x)), 0, 0, 0); }
  float scale = sqrt(max(0.0, 0.5 * (norm - z.x))) / vlen;
  return vec4(sqrt(max(0.0, 0.5 * (norm + z.x))), z.y * scale, z.z * scale, z.w * scale);
}

vec2 cinvpgamma(vec2 z) { // it's simple formula i use this
    vec2 result = cmul(z, cexp(EULER_GAMMA * z));
    mat4 prime16 = mat4(2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53);
    mat4 prime32 = mat4(59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131);
    for (int col = 0; col < 4; col++) {
      for (int row = 0; row < 4; row++) {
        float invn = 1.0 / float(prime16[row][col]);
        result = cmul(result, cmul(vec2(1.0, 0.0) + z * invn, cexp(-z * invn)));
        invn = 1.0 / float(prime32[row][col]);
        result = cmul(result, cmul(vec2(1.0, 0.0) + z * invn, cexp(-z * invn)));
      }
    }
    return result;
  }
