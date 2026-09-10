let uniformcode = `
  precision highp float;
  uniform vec2 iResolution;
  uniform float iTime;
  uniform float cxval;
  uniform float cyval;
  uniform float zoommandel;
  uniform float zxval;
  uniform float zyval;
  uniform float zoomjulia;
  uniform float range;
  uniform float power;
  uniform float logval;
  uniform float inverse;
  uniform float zwval;
  uniform float cwval;
  uniform float cosrotx;
  uniform float sinrotx;
  uniform float cosrotz;
  uniform float sinrotz;
  uniform float multlight;
  uniform float scaleval;
  uniform int ismandel;
  uniform int isnewton;
  uniform int isburning;
  uniform int isminusone;
  uniform int isconj;
  uniform int colorschemeindex;
  uniform int iteration;`;

let mathcode = `
  #define PI 3.14159265359
  #define EULER_GAMMA 0.5772156649015329

  float sinh(float x) { float ex = exp(x); return (ex - 1.0 / ex) * 0.5; }
  float cosh(float x) { float ex = exp(x); return (ex + 1.0 / ex) * 0.5; }
  float fast_pow(float x, float y) {
      if (y > 0.0) {
          if (y == 1.0) return x;
          if (y == 2.0) return x * x;
          if (y == 3.0) return x * x * x;
          return pow(x, y);
      }
      if (y == 0.0) return 1.0;
      if (y == -1.0) return 1.0 / x;
      if (y == -2.0) return 1.0 / (x * x);
      if (y == -0.5) return 1.0 / sqrt(x);
      if (y == -1.5) return 1.0 / x * (1.0 / sqrt(x));
      return 1.0 / pow(x, -y);
  }

  float cabs_sq(vec2 z) { return dot(z, z); }
  float cabs(vec2 z) { return length(z); }
  float cabs_pow(vec2 z, float k) { return fast_pow(dot(z, z), k); }
  float cabs_log(vec2 z, float k) { return log(dot(z, z)) * k; }
  float carg(vec2 z) { return atan(z.y, z.x); }
  vec2 cmul_i(vec2 z) { return vec2(-z.y, z.x); }
  vec2 cconj(vec2 z) { return vec2(z.x, -z.y); }
  vec2 conj(vec2 z) { return vec2(z.x, -z.y); }
  vec2 cshift(vec2 z) { return vec2(z.y, z.x); } // cmul_i(conj(z));
  vec2 cneg(vec2 z) { return z * -1.0; }
  vec2 cinv(vec2 z) { return vec2(z.x, -z.y) / dot(z, z); }
  vec2 clog(vec2 z) { return vec2(log(length(z)), carg(z)); }
  vec2 csq(vec2 z) { return vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y); }
  vec2 csqrt(vec2 z) { float phi = carg(z) * 0.5; return sqrt(length(z)) * vec2(cos(phi), sin(phi)); }
  vec2 cexp(vec2 z) { return exp(z.x) * vec2(cos(z.y), sin(z.y)); }
  vec2 cadd(vec2 z, vec2 w) { return vec2(z.x + w.x, z.y + w.y); }
  vec2 csub(vec2 z, vec2 w) { return cadd(z, cneg(w)); }
  vec2 cmul(vec2 z, vec2 w) { return vec2(z.x * w.x - z.y * w.y, z.x * w.y + z.y * w.x); }
  vec2 cmul(vec2 z, float w) { return z * w; }
  vec2 cmul(float z, vec2 w) { return z * w; }
  vec2 cdiv(vec2 z, vec2 w) { return cmul(z, cinv(w)); }
  vec2 cpow(vec2 z, vec2 w) { 
    if (w.y == 0.0) { 
      if (w.x == 1.0) return z;
      if (w.x == 2.0) return csq(z);
      if (w.x == 3.0) return cmul(csq(z), z);
      if (w.x == -2.0) return cinv(csq(z));
      if (w.x == -1.0) return cinv(z);
      if (w.x == 0.0) return vec2(1.0, 0.0);
      return cexp(w.x * clog(z));
    } else if (z.y == 0.0 && z.x > 0.0) { return cexp(w * log(z.x)); }
    return cexp(cmul(w, clog(z)));
  }
  vec2 croot(vec2 z, vec2 w) { return cpow(z, cinv(w)); }
  vec2 cre(vec2 z) { return (z + conj(z)) * 0.5; }
  vec2 cim(vec2 z) { return (z - conj(z)) * 0.5; }
  vec2 ccomp_identity(vec2 z) { return cre(z) + cim(z); }
  vec2 csign(vec2 z) { return z / length(z); }
  vec2 cmax(vec2 z, vec2 w) { return vec2(max(z.x, w.x), max(z.y, w.y)); }
  vec2 cmin(vec2 z, vec2 w) { return vec2(min(z.x, w.x), min(z.y, w.y)); }
  vec2 crelumax(vec2 z) { return cmax(z, vec2(0.0, 0.0)); }
  vec2 crelumin(vec2 z) { return cmin(z, vec2(0.0, 0.0)); }
  vec2 cfloor(vec2 z) { return floor(z); }
  vec2 cceil(vec2 z) { return ceil(z); }
  vec2 cround(vec2 z) { return floor(z + 0.5); }
  vec2 cstep(vec2 z) { return vec2(step(0.0, z.x), 0.0); }
  vec2 cclamp(vec2 z, vec2 w, vec2 s) { return vec2(clamp(z.x, w.x, s.y), clamp(z.y, w.y, s.y)); }
  vec2 ccomp_dotre(vec2 z, vec2 w) { return cre(z) * cre(w) + cim(z) * cim(w); }
  vec2 ccomp_dotim(vec2 z, vec2 w) { return cre(w) * cim(z) - cim(w) * cre(z); }
  // vec2 ccomp_dim(vec2 z, vec2 w) { return cre(z) * cim(w) - cim(w) * cre(z); }
  vec2 ccomp_abs(vec2 z) { return vec2(cabs(cre(z)), cabs(cim(z))); } // return vec2(abs(z.x), abs(z.y));
  vec2 ccomp_pow(vec2 z, float k) { return vec2(fast_pow(z.x, k), fast_pow(z.y, k)); }
  //vec2 cdotalt(vec2 z, vec2 w) { return vec2(z.x * w.x + z.y * w.y, w.x * z.y + w.y * z.x); }
  vec2 cdot(vec2 z, vec2 w) { return vec2(z.x * w.x + z.y * w.y, w.x * z.y - w.y * z.x); }
  vec2 csop(vec2 z, vec2 w) { return cdiv(z, conj(w)); }
  vec2 ch(vec2 z, vec2 w) { return -w/2.0 * clog(z); }
  vec2 ctau(vec2 z, vec2 w) { return vec2(1.0, 0.0) - cpow(z, vec2(0.5, 0.0) - w); }
  vec2 ctau2(vec2 z) { return 2.0 * cexp(-0.69314718056 * z); }
  vec2 cinvmix(vec2 z, float s) { return mix(z, cinv(z), s); } // return cinv(z) * s + z * (1.0 - s);
  vec2 crefhalf(vec2 z) { return vec2(1.0, 0.0) - z; }
  vec2 cdotlog(vec2 z, vec2 w, vec2 k) { return cmul(clog(cdot(z, w)), k); }
  vec2 cdotpow(vec2 z, vec2 w, vec2 k) { return cpow(cdot(z, w), k); }
  vec2 cmpow(vec2 z, vec2 w) { return cmul(cexp(log(length(z)) * w), cexp(cmul(vec2(0.0, carg(z)), (vec2(1.0, 0.0) - cexp(PI * vec2(-w.y, w.x))) * 0.5))); }
  vec2 csin(vec2 z) { float ey = exp(z.y); float eyminus = 1.0 / ey; return vec2(sin(z.x) * (ey + eyminus) * 0.5, cos(z.x) * (ey - eyminus) * 0.5); }
  vec2 ccos(vec2 z) { float ey = exp(z.y); float eyminus = 1.0 / ey; return vec2(cos(z.x) * (ey + eyminus) * 0.5, -sin(z.x) * (ey - eyminus) * 0.5); }
  vec2 csin_slow(vec2 z) { return vec2(sin(z.x) * cosh(z.y), cos(z.x) * sinh(z.y)); }
  vec2 ccos_slow(vec2 z) { return vec2(cos(z.x) * cosh(z.y), -sin(z.x) * sinh(z.y)); }
  vec2 csinh(vec2 z) { return vec2(sinh(z.x) * cos(z.y), cosh(z.x) * sin(z.y)); }
  vec2 ccosh(vec2 z) { return vec2(cosh(z.x) * cos(z.y), sinh(z.x) * sin(z.y)); }
  vec2 csinw(vec2 z, vec2 w) { return cpow(csin(z), w); }
  vec2 ccosw(vec2 z, vec2 w) { return cpow(ccos(z), w); }
  vec2 csinhw(vec2 z, vec2 w) { return cpow(csinh(z), w); }
  vec2 ccoshw(vec2 z, vec2 w) { return cpow(ccosh(z), w); }
  vec2 ctanw(vec2 z, vec2 w, vec2 s) { return cmul(cpow(csin(z), s), cpow(ccos(z), w)); }
  vec2 ccotw(vec2 z, vec2 w, vec2 s) { return cmul(cpow(ccos(z), s), cpow(csin(z), w)); }
  vec2 ctanhw(vec2 z, vec2 w, vec2 s) { return cmul(cpow(csinh(z), s), cpow(ccosh(z), w)); }
  vec2 ccothw(vec2 z, vec2 w, vec2 s) { return cmul(cpow(ccosh(z), s), cpow(csinh(z), w)); }
  vec2 clogn(vec2 z, vec2 w) { return cdiv(clog(z), clog(w)); }
  vec2 ctanh(vec2 z) { return cdiv(csinh(z), ccosh(z)); } // return vec2(1.0, 0.0) - 2.0 / (vec2(1.0, 0.0) + cexp(2.0 * z));
  vec2 ccoth(vec2 z) { return cdiv(ccosh(z), csinh(z)); }
  vec2 ctan(vec2 z) { return cdiv(csin(z), ccos(z)); }
  vec2 ccot(vec2 z) { return cinv(ctan(z)); }
  vec2 carcsin(vec2 z) { vec2 a = csqrt(vec2(1.0, 0.0) - csq(z)); return z.y < 0.0 ? -cmul_i(clog(a + cmul_i(z))) : -cmul_i(-clog(a - cmul_i(z))); }
  vec2 carccos(vec2 z) { return vec2(0.5 * PI, 0.0) - carcsin(z); }
  vec2 cfib(vec2 z) { return (cpow(vec2(1.61803398875, 0.0), z) - cpow(vec2(-0.61803398875, 0.0), z)) * 0.4472135955; }
  vec2 cgamma_right(vec2 z) {
      vec2 w = z - vec2(1.0, 0.0);
      vec2 t = w + vec2(7.5, 0.0);
      vec2 x = vec2(0.99999999999980993, 0.0);
      x += 676.5203681218851 * cinv(w + vec2(1.0, 0.0));
      x -= 1259.1392167224028 * cinv(w + vec2(2.0, 0.0));
      x += 771.32342877765313 * cinv(w + vec2(3.0, 0.0));
      x -= 176.61502916214059 * cinv(w + vec2(4.0, 0.0));
      x += 12.507343278686905 * cinv(w + vec2(5.0, 0.0));
      x -= 0.13857109526572012 * cinv(w + vec2(6.0, 0.0));
      x += 9.9843695780195716e-6 * cinv(w + vec2(7.0, 0.0));
      x += 1.5056327351493116e-7 * cinv(w + vec2(8.0, 0.0));
      return 2.50662827463 * cmul(x, cexp(cmul(clog(t), w + vec2(0.5, 0.0)) - t));
  }
  vec2 cgamma_left(vec2 z) { return PI * cinv(cmul(csin(z * PI), cgamma_right(vec2(1.0, 0.0) - z))); }
  vec2 cgamma(vec2 z) { return z.x < 0.5 ? cgamma_left(z) : cgamma_right(z); }
  vec2 cinvgamma(vec2 z) {
      vec2 result = cmul(z, cexp(EULER_GAMMA * z));
      for (int n = 1; n <= 32; n++) {
          float invn = 1.0 / float(n);
          result = cmul(result, cmul(vec2(1.0, 0.0) + z * invn, cexp(-z * invn)));
      }
      return result;
  }
  vec2 cinvpgamma(vec2 z) { // calc with log
      vec2 result = cmul(z, cexp(EULER_GAMMA * z));
      mat4 prime16 = mat4(2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53);
      mat4 prime32 = mat4(59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131);
      for (int col = 0; col < 4; col++) {
          for (int row = 0; row < 4; row++) {
              float invn = 1.0 / float(prime16[row][col]);
              result = cmul(result, cmul(vec2(1.0, 0.0) + z * invn, cexp(-z * invn)));
          }
      }
      for (int col = 0; col < 4; col++) {
          for (int row = 0; row < 4; row++) {
              float invn = 1.0 / float(prime32[row][col]);
              result = cmul(result, cmul(vec2(1.0, 0.0) + z * invn, cexp(-z * invn)));
          }
      }
      return result;
  }
  vec2 cpgamma(vec2 z) { return cinv(cinvpgamma(z)); }
  vec2 cbeta(vec2 z, vec2 w) { return cmul(cmul(cgamma(z), cgamma(w)), cinv(cgamma(z + w))); }
  vec2 cdigamma(vec2 z) {
      vec2 s = vec2(0.0, 0.0);
      for (int k = 0; k < 32; ++k) {
          s -= cinv(z);
          z += vec2(1.0, 0.0);
      }
      vec2 inv1 = cinv(z);
      vec2 inv2 = csq(inv1);
      vec2 inv4 = csq(inv2);
      vec2 inv6 = cmul(inv4, inv2);
      vec2 inv8 = csq(inv4);
      vec2 inv10 = cmul(inv8, inv2);
      vec2 inv12 = cmul(inv10, inv2);
      vec2 inv14 = cmul(inv12, inv2);
      vec2 result = clog(z);
      result -= inv1 * (1.0 / 2.0);
      result -= inv2 * (1.0 / 12.0);
      result += inv4 * (1.0 / 120.0);
      result -= inv6 * (1.0 / 252.0);
      result += inv8 * (1.0 / 240.0);
      result -= inv10 * (5.0 / 660.0);
      result += inv12 * (691.0 / 32760.0);
      result -= inv14 * (1.0 / 12.0);
      return result + s;
  }

  vec2 cgammaphi(vec2 z) { return cexp(cmul(z, vec2(-3.53102424697, 1.57079632679) + clog(vec2(1.0, 0.0) - 2.0 * z)) - 0.5 * clog(z) + vec2(1.4189385332, 0.0)); }

  vec2 czeta_left(vec2 z) { return cmul(cpow(vec2(2.0 * PI, 0.0), z - vec2(1.0, 0.0)) * 2.0, cmul(csin(z * PI * 0.5), cgamma(vec2(1.0, 0.0) - z))); }

  vec4 czeta_helper_4(vec2 z, mat4 bases, mat4 ns) {
      mat4 phases = z.y * bases;
      float cutoff = sqrt(z.y * 0.159154943092) + 100.0 * step(z.y, 120.0);
      float cutoffscale = 0.884 * cutoff + 0.442;
      vec4 res = vec4(0.0, 0.0, 0.0, 0.0);
      for (int row = 0; row < 4; row++) {
          vec4 mags = exp(z.x * bases[row]);
          vec4 cutoffv = clamp(cutoffscale - 0.884 * ns[row], 0.0, 1.0);
          vec4 mags2 = cutoffv / (ns[row] * mags);
          mags *= cutoffv;
          vec4 re = cos(phases[row]);
          vec4 im = sin(phases[row]);
          res += vec4(dot(mags, re), dot(mags, im), dot(mags2, re), -dot(mags2, im));
      }
      return res;
  }

  vec2 czeta_helper_2(vec2 z, mat4 bases, mat4 coeffs) {
      mat4 phases = z.y * bases;
      vec2 res = vec2(0.0, 0.0);
      for (int row = 0; row < 4; row++) {
          vec4 mags = exp(z.x * bases[row]) * coeffs[row];
          vec4 re = cos(phases[row]);
          vec4 im = sin(phases[row]);
          res += vec2(dot(mags, re), dot(mags, im));
      }
      return res;
  }

  vec2 czeta_strip(vec2 z) {
      vec4 zeta_est = vec4(1.0, 0.0, 1.0, 0.0);
      zeta_est += czeta_helper_4(z,
      mat4(-0.69314718056,-1.09861228866811,-1.38629436111989,-1.6094379124341,-1.79175946922805,-1.94591014905531,-2.07944154167984,-2.19722457733622,-2.30258509299405,-2.39789527279837,-2.48490664978800,-2.56494935746154,-2.63905732961526,-2.70805020110221,-2.77258872223978,-2.83321334405622),
      mat4(2.,3.,4.,5.,6.,7.,8.,9.,10.,11.,12.,13.,14.,15.,16.,17.));
      zeta_est += czeta_helper_4(z,
      mat4(-2.89037175789616,-2.94443897916644,-2.99573227355399,-3.04452243772342,-3.09104245335832,-3.13549421592915,-3.17805383034795,-3.21887582486820,-3.25809653802148,-3.29583686600433,-3.33220451017520,-3.36729582998647,-3.40119738166216,-3.43398720448515,-3.46573590279973,-3.49650756146648),
      mat4(18.,19.,20.,21.,22.,23.,24.,25.,26.,27.,28.,29.,30.,31.,32.,33.));
      vec2 zetaA = zeta_est.xy;
      vec2 zetaB = cmul(zeta_est.zw, conj(cgammaphi(vec2(1.0, 0.0) - conj(z))));
      if (z.y < 120.0) {
          float t = 1.0 - min(z.x, 1.0);
          float alpha = t * t * (3.0 - 2.0 * t);
          return mix(zetaA, zetaB, alpha);
      }
      return zetaA + zetaB;
  }

  vec2 ceta_strip(vec2 z) { return cmul(czeta_strip(z), vec2(1.0, 0.0) - 2.0 * cexp(-0.69314718056 * z)); }
  vec2 ceta_right(vec2 z) {
      if (z.x < 3.0 && z.y > 54.0) { return ceta_strip(z); }
      vec2 result = vec2(1.0, 0.0);
      result += czeta_helper_2(z,
      mat4(-0.69314718056,-1.09861228866811,-1.38629436111989,-1.6094379124341,-1.79175946922805,-1.94591014905531,-2.07944154167984,-2.19722457733622,-2.30258509299405,-2.39789527279837,-2.48490664978800,-2.56494935746154,-2.63905732961526,-2.70805020110221,-2.77258872223978,-2.83321334405622),
      mat4(-1.00000000000000,1.00000000000000,-1.00000000000000,1.00000000000000,-0.99999999999995,0.99999999999847,-0.99999999996425,0.99999999937104,-0.99999999142280,0.99999990708781,-0.99999918494666,0.99999411949279,-0.99996466193028,0.99982127062071,-0.99923254216349,0.99718148818347));
      result += czeta_helper_2(z,
      mat4(-2.89037175789616,-2.94443897916644,-2.99573227355399,-3.04452243772342,-3.09104245335832,-3.13549421592915,-3.17805383034795,-3.21887582486820,-3.25809653802148,-3.29583686600433,-3.33220451017520,-3.36729582998647,-3.40119738166216,-3.43398720448515,-3.46573590279973,-3.49650756146648),
      mat4(-0.99109047939434,0.97562125072353,-0.94195422388664,0.87910910712444,-0.77852772396727,0.64073335549827,-0.47964042231228,0.31968999219853,-0.18572334624203,0.09196690020310,-0.03784892366350,0.01254701255408,-0.00320994916827,0.00059346134942,-0.00007044051625,0.00000402517236));
      return result;
  }

  vec2 ceta_left(vec2 z) {
      z.x = -z.x;
      vec2 component_a;
      float log_r = log(length(z));
      if (z.y > 200.0) {
          component_a = 1.2533141373155001 * cmul_i(cexp(vec2(z.x, 0.0) + (log_r - 1.0) * z - vec2(log_r * 0.5, 0.785398163397)));
      } else if (z.y > 20.0) {
          float theta = atan(z.y, z.x);
          component_a = 1.2533141373155001 * cmul_i(cexp((theta - 1.57079632679) * cmul_i(z) + (log_r - 1.0) * z - 0.5 * vec2(log_r, theta)));
      } else {
          component_a = cmul(cgamma(z), csin(z * 1.57079632679));
      }
      vec2 zadd1 = z + vec2(1.0, 0.0);
      vec2 two_neg_z = cexp(-0.69314718056 * z);
      vec2 multiplier = cmul(cexp(-1.14472988585 * zadd1), cmul(vec2(1.0, 0.0) - 0.5 * two_neg_z, cinv(vec2(1.0, 0.0) - two_neg_z)));
      vec2 component_b = cmul(z, ceta_right(zadd1));
      return 2.0 * conj(cmul(cmul(component_a, component_b), multiplier));
  }

  vec2 ceta(vec2 z) {
    vec2 conjugate_mask = vec2(1.0, 1.0);
    if (z.y < 0.0) { z.y = -z.y; conjugate_mask.y = -1.0; }
    return (z.x < 0.0 ? ceta_left(z) : ceta_right(z)) * conjugate_mask;
  }

  vec2 czeta(vec2 z) { return cmul(ceta(z), cinv(vec2(1.0, 0.0) - 2.0 * cexp(-0.69314718056 * z))); }
  vec2 cgammasi(vec2 z) { float t = 1.0; return vec2(1.0, 0.0) - cdiv(cgamma((vec2(1.0, 0.0) - z) * t), cgamma(z * t)); }
  vec2 cgammapsi(vec2 z) { return vec2(1.0, 0.0) - cdiv(cpgamma(vec2(1.0, 0.0) - z), cpgamma(z)); }
  vec2 czsinh(vec2 z, vec2 t) { return (czeta(z + t) - czeta(t - z)) * 0.5; }
  vec2 czcosh(vec2 z, vec2 t) { return (czeta(z + t) + czeta(t - z)) * 0.5; }
  vec2 clogmap(vec2 z, vec2 w) { return cmul(cmul(z, w), (vec2(1.0, 0.0) - w)); }
  float sq(float x) { return x * x; }
  float inv(float x) { return 1.0 / x; }
  float logmap(float r, float x) { return r * x * (1.0 - x); }
  float logmap_derv(float r, float x) { return r * (1.0 - x - x); }
  float exp_derv(float x) { return exp(x); }
  float pow_derv(float x, float y) { return fast_pow(x, y - 1.0) * y; }
  float powy_derv(float x, float y) { return fast_pow(x, y) * log(x); }
  float sin_derv(float x) { return cos(x); }
  float cos_derv(float x) { return -sin(x); }
  float cosh_derv(float x) { return cosh(x); }
  float sinh_derv(float x) { return sinh(x); }
  float tan_derv(float x) { return sq(inv(cos(x))); }
  vec2 ctau_derv(vec2 z, vec2 w) { return cmul(cpow(w, vec2(0.5, 0.0) - z), clog(w)); }
  vec2 ctanh_derv(vec2 z) { return vec2(1.0, 0.0) - csq(ctanh(z)); }
  vec2 ctan_derv(vec2 z) { return csq(cinv(ccos(z))); }
  vec2 cpow_derv(vec2 z, vec2 w) { return cmul(w, cpow(z, w - vec2(1.0, 0.0))); }
  vec2 clog_derv(vec2 z) { return cinv(z); }
  vec2 cinv_derv(vec2 z) { return -cinv(csq(z)); }
  vec2 cgamma_derv(vec2 z) { return cmul(cgamma(z), cdigamma(z)); }
  vec2 czeta_derv(vec2 z) { vec2 dz = vec2(0.0, 0.001); return cmul(czeta(z + dz) - czeta(z - dz), cinv(2.0 * dz)); }
  vec2 ceta_derv(vec2 z) { vec2 dz = vec2(0.0, 0.001); return cmul(ceta(z + dz) - ceta(z - dz), cinv(2.0 * dz)); }
  vec2 cdzsinh(vec2 z, vec2 t) { vec2 dz = vec2(0.0, 0.001); return cmul(czsinh(z + dz, t) - czsinh(z - dz, t), cinv(2.0 * dz)); }
  vec2 cdzcosh(vec2 z, vec2 t) { vec2 dz = vec2(0.0, 0.001); return cmul(czcosh(z + dz, t) - czcosh(z - dz, t), cinv(2.0 * dz)); }
  vec2 cdlogzeta(vec2 z) { return cdiv(czeta(z), czeta_derv(z)); }
  //vec2 cdloggamma(vec2 z) { return cdiv(cgamma(z), cdgamma(z)); }

  vec2 invert_tau(vec2 z) {
    vec2 rt_k = csqrt(csqrt(vec2(1.0, 0.0) - csq(z)));
    vec2 ell = 0.5 * cdiv(vec2(1.0, 0.0) - rt_k, vec2(1.0, 0.0) + rt_k);
    vec2 log_l = clog(ell);
    vec2 q = ell + 2.0 * cexp(5.0 * log_l) + 15.0 * cexp(9.0 * log_l);
    return -cmul_i(clog(q)) / PI;
  }
  vec2 theta3(vec2 z, vec2 w) {
    vec2 result = vec2(1.0, 0.0);
    vec2 iz = 2.0 * cmul_i(z);
    vec2 iw = cmul_i(w);
    for (int i = 1; i < 4; i++) {
      float n = float(i);
      float fn = n * n;
      vec2 A = n * iz;
      vec2 B = fn * iw;
      result += cexp(PI * (B + A));
      result += cexp(PI * (B - A));
    }
    return result;
  }
  vec2 theta3_z0(vec2 w) {
    vec2 result = vec2(0.5, 0.0);
    vec2 iz = cmul_i(w);
    for (int i = 1; i < 8; i++) {
      float n = float(i);
      float fn = n * n;
      result += cexp(PI * fn * iz);
    }
    return 2.0 * result;
  }
  vec2 jacobi_reduce(vec2 z, vec2 w) { vec2 t00 = theta3_z0(w); vec2 zz = cdiv(z, PI * csq(t00)); float n = 2.0 * floor(0.5 * zz.y / w.y + 0.5); return zz - n * w; }
  vec2 theta2(vec2 z, vec2 w) { return theta3(z + 0.5 * vec2(1.0, 0.0), w); } // theta01f
  vec2 theta4(vec2 z, vec2 w) { return cmul(cexp(PI * cmul_i(z + 0.25 * w)), theta3(z + 0.5 * w, w)); } // theta10f
  vec2 theta1(vec2 z, vec2 w) { return cmul(cexp(PI * 0.25 * cmul_i(w + 4.0 * z + 2.0 * vec2(1.0, 0.0))), theta3(z + 0.5 * (w + vec2(1.0, 0.0)), w)); }
  vec2 raw_sn(vec2 z, vec2 w) { return -cdiv(cmul(theta3_z0(w), theta1(z, w)), cmul(theta4(vec2(0.0, 0.0), w), theta2(z, w))); }
  vec2 raw_cn(vec2 z, vec2 w) { return cdiv(cmul(theta2(vec2(0.0, 0.0), w), theta4(z, w)), cmul(theta4(vec2(0.0, 0.0), w), theta2(z, w))); }
  vec2 raw_dn(vec2 z, vec2 w) { return cdiv(cmul(theta2(vec2(0.0, 0.0), w), theta3(z, w)), cmul(theta3_z0(w), theta2(z, w))); }
  vec2 raw_wp_derv(vec2 z, vec2 w, vec2 w1) { return -2.0 * cmul(cexp(3.0 * clog(cdiv(w, raw_sn(z, w1)))), cmul(raw_cn(z, w1), raw_dn(z, w1))); }
  vec2 csn(vec2 z, vec2 w) { vec2 tau = invert_tau(w); return raw_sn(jacobi_reduce(z, tau), tau); }
  vec2 ccn(vec2 z, vec2 w) { vec2 tau = invert_tau(w); return raw_cn(jacobi_reduce(z, tau), tau); }
  vec2 cdn(vec2 z, vec2 w) { vec2 tau = invert_tau(w); return raw_dn(jacobi_reduce(z, tau), tau); }
  vec2 cwp(vec2 z, vec2 w) {
    float n = floor(z.y / w.y + 0.5);
    vec2 zz = z - n * w;
    vec2 t002 = csq(theta3_z0(w));
    vec2 t102 = csq(theta4(vec2(0.0, 0.0), w));
    vec2 e2 = -(PI*PI/3.0) * (csq(t102) + csq(t002));
    return PI*PI*cmul(cmul(t002, t102), csq(cdiv(theta2(zz, w), theta1(zz, w)))) + e2;
  }
  vec2 cwp_derv(vec2 z, vec2 w) {
    const float PI2_3 = PI * PI / 3.0;
    vec2 t004 = csq(csq(theta3_z0(w)));
    vec2 t104 = csq(csq(theta4(vec2(0.0, 0.0), w)));
    vec2 t014 = csq(csq(theta2(vec2(0.0, 0.0), w)));
    vec2 e1 = PI2_3 * (t004 + t014);
    vec2 e2 = -PI2_3 * (t104 + t004);
    vec2 e3 = PI2_3 * (t104 - t014);
    vec2 A = csqrt(e1 - e3);
    vec2 B = csqrt(e2 - e3);
    vec2 tau = invert_tau(cdiv(B, A));
    return raw_wp_derv(jacobi_reduce(cmul(z, A), tau), A, tau);
  }
  vec2 csn_derv(vec2 z, vec2 w) { float eps = 1e-5; return (csn(z + vec2(eps, 0.0), w) - csn(z - vec2(eps, 0.0), w)) / (2.0 * eps); }
  vec2 ccn_derv(vec2 z, vec2 w) { float eps = 1e-5; return (csn(z + vec2(eps, 0.0), w) - csn(z - vec2(eps, 0.0), w)) / (2.0 * eps); }
  vec2 cdn_derv(vec2 z, vec2 w) { float eps = 1e-5; return (csn(z + vec2(eps, 0.0), w) - csn(z - vec2(eps, 0.0), w)) / (2.0 * eps); }

  float qabs_sq(vec4 z) { return dot(z, z); }
  float qabs(vec4 z) { return length(z); }
  float qarg(vec4 z) { float qlen = length(z); if (qlen < 1e-8) return 0.0; return acos(clamp(z.x / qlen, -1.0, 1.0)); }
  vec4 qsq(vec4 z) { return vec4(z.x * z.x - z.y * z.y - z.z * z.z - z.w * z.w, 2.0 * z.x * z.yzw); }
  /*vec4 qsqrt(vec4 q) {
    float a = q.x, b = q.y, c = q.z, d = q.w;
    float norm = sqrt(a*a + b*b + c*c + d*d); // length
    float lenV = sqrt(b*b + c*c + d*d);
    if (lenV < 1e-10) { return vec4(sqrt(max(0.0, a)), 0, 0, 0); }
    float scale = sqrt(max(0.0, 0.5 * (norm - a))) / lenV;
    return vec4(sqrt(max(0.0, 0.5 * (norm + a))), b * scale, c * scale, d * scale);
  }*/
  vec4 qneg(vec4 z) { return z * -1.0; }
  vec4 qconj(vec4 z) { return vec4(z.x, -z.yzw); }
  vec4 qinv(vec4 z) { return vec4(z.x, -z.yzw) / dot(z, z); }
  vec4 qadd(vec4 z, vec4 w) { return z + w; }
  vec4 qsub(vec4 z, vec4 w) { return z - w; }
  vec4 qmul(vec4 z, vec4 w) { return vec4(z.x * w.x - dot(z.yzw, w.yzw), z.x * w.yzw + w.x * z.yzw + cross(z.yzw, w.yzw)); }
  vec4 qmul(vec4 z, float w) { return z * w; }
  vec4 qmul(float z, vec4 w) { return z * w; }
  vec4 qdiv(vec4 z, vec4 w) { return qmul(z, qinv(w)); } // qmul(qinv(w), z)
  vec4 qexp(vec4 z) { float vlen = length(z.yzw), expv = exp(z.x); if (vlen < 1e-6) return vec4(expv, z.yzw); return expv * vec4(cos(vlen), sin(vlen) / vlen * z.yzw); }
  vec4 qlog(vec4 z) { float vlen = length(z.yzw), qlen = length(z); float logv = log(qlen); if (vlen < 1e-6) return vec4(logv, 0.0, 0.0, 0.0); return vec4(logv, acos(clamp(z.x / qlen, -1.0, 1.0)) / vlen * z.yzw); }
  vec4 qlog(float x) { if (x > 0.0) return vec4(log(x), 0.0, 0.0, 0.0); if (x < 0.0) return vec4(log(-x), 3.14159265359, 0.0, 0.0); return vec4(0.0, 0.0, 0.0, 0.0); }
  vec4 qsin(vec4 z) { float vlen = length(z.yzw); if (vlen < 1e-6) vlen = 1e-6; return vec4(sin(z.x) * cosh(vlen), cos(z.x) * sinh(vlen) / vlen * z.yzw); }
  vec4 qcos(vec4 z) { float vlen = length(z.yzw); if (vlen < 1e-6) vlen = 1e-6; return vec4(cos(z.x) * cosh(vlen),-sin(z.x) * sinh(vlen) / vlen * z.yzw); }
  vec4 qsinh(vec4 z) {float vlen = length(z.yzw); if (vlen < 1e-6) vlen = 1e-6; return vec4(sinh(z.x) * cos(vlen), cosh(z.x) * sin(vlen) / vlen * z.yzw); }
  vec4 qcosh(vec4 z) {float vlen = length(z.yzw); if (vlen < 1e-6) vlen = 1e-6; return vec4(cosh(z.x) * cos(vlen), sinh(z.x) * sin(vlen) / vlen * z.yzw); }
  vec4 qdot(vec4 z, vec4 w) { return qmul(z, qconj(w)); }
  vec4 qsop(vec4 z, vec4 w) { return qdiv(z, qconj(w)); }
  vec4 qtan(vec4 z) { return qdiv(qsin(z), qcos(z)); }
  vec4 qcot(vec4 z) { return qdiv(qcos(z), qsin(z)); }
  vec4 qtanh(vec4 z) { return qdiv(qsinh(z), qcosh(z)); }
  vec4 qcoth(vec4 z) { return qdiv(qcosh(z), qsinh(z)); }
  vec4 qpow(vec4 z, float w) {
    if (w == 2.0) return qsq(z);
    else if (w == 1.0) return z;
    else if (w == 0.0) return vec4(1.0, 0.0, 0.0, 0.0);
    else if (w ==-1.0) return qinv(z);
    else if (w ==-2.0) return qinv(qsq(z));
    else if (w ==-3.0) return qinv(qmul(qsq(z), z));
    return qexp(w * qlog(z));
  }
  //vec4 qpow(float z, vec4 w) { return qexp(w * qlog(z)); }
  vec4 qpow(vec4 z, vec4 w) {
    if (w.y == 0.0 && w.z == 0.0 && w.w == 0.0) { return qpow(z, w.x); }
    return qexp(qmul(w, qlog(z))); // qexp(qmul(qlog(z), w))
  }
  vec4 qsqrt(vec4 z) { return qpow(z, 0.5); }
  vec4 qroot(vec4 z, vec4 w) { return qpow(z, qinv(w)); }
  vec4 qsign(vec4 z) { return z / length(z); }
  vec4 qmax(vec4 z, vec4 w) { return vec4(max(z.x, w.x), max(z.y, w.y), max(z.z, w.z), max(z.w, w.w)); }
  vec4 qmin(vec4 z, vec4 w) { return vec4(min(z.x, w.x), min(z.y, w.y), min(z.z, w.z), min(z.w, w.w)); }
  vec4 qrelumax(vec4 z) { return qmax(z, vec4(0.0, 0.0, 0.0, 0.0)); }
  vec4 qrelumin(vec4 z) { return qmin(z, vec4(0.0, 0.0, 0.0, 0.0)); }
  vec4 qfloor(vec4 z) { return floor(z); }
  vec4 qceil(vec4 z) { return ceil(z); }
  vec4 qround(vec4 z) { return floor(z + 0.5); }
  vec4 qstep(vec4 z) { return vec4(step(0.0, z.x), 0.0, 0.0, 0.0); }
  vec4 qclamp(vec4 z, vec4 w, vec4 s) { return vec4(clamp(z.x, w.x, s.y), clamp(z.y, w.y, s.y), clamp(z.z, w.z, s.z), clamp(z.w, w.w, s.w)); }
  vec4 qtau(vec4 z, vec4 w) { return vec4(1.0, 0.0, 0.0, 0.0) - qpow(z, vec4(0.5, 0.0, 0.0, 0.0) - w); }
  vec4 qtau_derv(vec4 z, vec4 w) { return qmul(qpow(w, vec4(0.5, 0.0, 0.0, 0.0) - z), qlog(w)); }
  vec4 qgamma_right(vec4 z) {
    vec4 w = z - vec4(1.0, 0.0, 0.0, 0.0);
    vec4 t = w + vec4(7.5, 0.0, 0.0, 0.0);
    vec4 x = vec4(0.99999999999980993, 0.0, 0.0, 0.0);
    x += 676.5203681218851 * qinv(w + vec4(1.0, 0.0, 0.0, 0.0));
    x -= 1259.1392167224028 * qinv(w + vec4(2.0, 0.0, 0.0, 0.0));
    x += 771.32342877765313 * qinv(w + vec4(3.0, 0.0, 0.0, 0.0));
    x -= 176.61502916214059 * qinv(w + vec4(4.0, 0.0, 0.0, 0.0));
    x += 12.507343278686905 * qinv(w + vec4(5.0, 0.0, 0.0, 0.0));
    x -= 0.13857109526572012 * qinv(w + vec4(6.0, 0.0, 0.0, 0.0));
    x += 9.9843695780195716e-6 * qinv(w + vec4(7.0, 0.0, 0.0, 0.0));
    x += 1.5056327351493116e-7 * qinv(w + vec4(8.0, 0.0, 0.0, 0.0));
    vec4 log_term = qmul(qlog(t), w + vec4(0.5, 0.0, 0.0, 0.0)) - t;
    return 2.50662827463 * qmul(x, qexp(log_term));
  }
  vec4 qgamma_left(vec4 z) { return PI * qinv(qmul(qsin(z * PI), qgamma_right(vec4(1.0, 0.0, 0.0, 0.0) - z))); }
  vec4 qgamma(vec4 z) { return z.x < 0.5 ? qgamma_left(z) : qgamma_right(z); }
  vec4 qgammasi(vec4 z) { return vec4(1.0, 0.0, 0.0, 0.0) - qdiv(qgamma(vec4(1.0, 0.0, 0.0, 0.0) - z), qgamma(z)); }
  vec4 qbeta(vec4 z, vec4 w) { return qmul(qmul(qgamma(z), qgamma(w)), qinv(qgamma(z + w))); }
  vec4 qfib(vec4 z) { return (qpow(vec4(1.61803398875, 0.0, 0.0, 0.0), z) - qpow(vec4(-0.61803398875, 0.0, 0.0, 0.0), z)) * 0.4472135955; }
  vec4 v4invmix(vec4 z, float w) { return z * (w / dot(z, z)) + (1.0 - w) * z; }
  vec4 v4abs(vec4 z) { return vec4(abs(z.x), -abs(z.y), -abs(z.z), abs(z.w)); }
  vec4 v4conj(vec4 z) { return vec4(z.x, -z.y, -z.z, z.w); }
  vec4 qpow_derv(vec4 z, float w) { return qpow(z, w - 1.0) * w; }
  vec4 qpow_derv(vec4 z, vec4 w) { return qmul(qpow(z, w - vec4(1.0, 0.0, 0.0, 0.0)), w); }

  float biabs_sq(vec4 z) { return dot(z, z); }
  float biabs(vec4 z) { return length(z); }
  vec4 bineg(vec4 z) { return z * -1.0; }
  vec4 biconj(vec4 z) { return vec4(z.x, -z.y, -z.z, z.w); }
  vec4 bisq(vec4 z) { return vec4(z.x * z.x - z.y * z.y - z.z * z.z + z.w * z.w, 2.0 * (z.x * z.y - z.z * z.w), 2.0 * (z.x * z.z - z.y * z.w), 2.0 * (z.x * z.w + z.y * z.z)); }
  vec2 bidabs_sq(vec4 z) { return cmul(z.xy, z.xy) + cmul(z.zw, z.zw); }
  vec2 bitoidempotent_left(vec4 z) { return vec2(z.x - z.w, z.y + z.z); }
  vec2 bitoidempotent_right(vec4 z) { return vec2(z.x + z.w, z.y - z.z); }
  vec4 bifromidempotent(vec2 z, vec2 w) { return 0.5 * vec4(w.x + z.x, z.y + w.y, z.y - w.y, w.x - z.x); }
  vec4 biinv(vec4 z) { vec2 len = bidabs_sq(z); vec2 invlen = conj(len) / dot(len, len); return vec4(cmul(z.xy, invlen), cmul(-z.zw, invlen)); }
  vec4 biadd(vec4 z, vec4 w) { return z + w; }
  vec4 bisub(vec4 z, vec4 w) { return z - w; }
  vec4 bimul(vec4 z, vec4 w) { return vec4(cmul(z.xy, w.xy) - cmul(z.zw, w.zw), cmul(z.xy, w.zw) + cmul(z.zw, w.xy)); }
  vec4 bimul(vec4 z, float w) { return z * w; }
  vec4 bimul(float z, vec4 w) { return z * w; }
  vec4 bidiv(vec4 z, vec4 w) { return bimul(z, biinv(w)); }
  vec4 biexp(vec4 z) { vec2 r = cexp(z.xy); return vec4(cmul(r, ccos(z.zw)), cmul(r, csin(z.zw))); }
  vec4 bilog(vec4 z) { vec2 logz = clog(z.xy + cmul_i(z.zw)); vec2 logw = clog(z.xy - cmul_i(z.zw)); return vec4(0.5 * (logz + logw), -0.5 * cmul_i(logz - logw)); }
  vec4 biarg(vec4 z) { vec2 arg = bilog(z).zw; return vec4(0.0, 0.0, arg.x, arg.y); } // check it's correct?
  vec4 bisin(vec4 z) { vec2 r1 = cexp(z.zw); vec2 r2 = cexp(-z.zw); return vec4(cmul(csin(z.xy), 0.5 * (r1 + r2)), cmul(ccos(z.xy), 0.5 * (r1 - r2))); }
  vec4 bicos(vec4 z) { vec2 r1 = cexp(z.zw); vec2 r2 = cexp(-z.zw); return vec4(cmul(ccos(z.xy), 0.5 * (r1 + r2)),-cmul(csin(z.xy), 0.5 * (r1 - r2))); }
  vec4 bisinh(vec4 z) { vec2 r1 = cexp(z.xy); vec2 r2 = cexp(-z.xy); return vec4(cmul(ccos(z.zw), 0.5 * (r1 - r2)), cmul(csin(z.zw), 0.5 * (r1 + r2))); }
  vec4 bicosh(vec4 z) { vec2 r1 = cexp(z.xy); vec2 r2 = cexp(-z.xy); return vec4(cmul(ccos(z.zw), 0.5 * (r1 + r2)), cmul(csin(z.zw), 0.5 * (r1 - r2))); }
  vec4 bitan(vec4 z) { return bidiv(bisin(z), bicos(z)); }
  vec4 bitanh(vec4 z) { return bidiv(bisinh(z), bicosh(z)); }
  vec4 bicot(vec4 z) { return bidiv(bicos(z), bisin(z)); }
  vec4 bicoth(vec4 z) { return bidiv(bicosh(z), bisinh(z)); }
  vec4 bipow(vec4 z, float w) {
    if (w == -2.0) { return biinv(bisq(z)); }
    else if (w == -1.0) { return biinv(z); }
    else if (w == 0.0) { return vec4(1.0, 0.0, 0.0, 0.0); }
    else if (w == 1.0) { return z; }
    else if (w == 2.0) { return bisq(z); }
    else if (w == 3.0) { return bimul(bisq(z), z); }
    return biexp(w * bilog(z));
  }
  //vec4 bipow(float z, vec4 w) { return biexp(bimul(w, bilog(vec4(z, 0.0, 0.0, 0.0)))); }
  vec4 bipow(vec4 z, vec4 w) {
    if (w.y == 0.0 && w.z == 0.0 && w.w == 0.0) { return bipow(z, w.x); }
    return biexp(bimul(w, bilog(z)));
  }
  vec4 biroot(vec4 z, vec4 w) { return bipow(z, biinv(w)); }
  vec4 bisign(vec4 z) { return z / length(z); }
  vec4 bimax(vec4 z, vec4 w) { return vec4(max(z.x, w.x), max(z.y, w.y), max(z.z, w.z), max(z.w, w.w)); }
  vec4 bimin(vec4 z, vec4 w) { return vec4(min(z.x, w.x), min(z.y, w.y), min(z.z, w.z), min(z.w, w.w)); }
  vec4 birelumax(vec4 z) { return bimax(z, vec4(0.0, 0.0, 0.0, 0.0)); }
  vec4 birelumin(vec4 z) { return bimin(z, vec4(0.0, 0.0, 0.0, 0.0)); }
  vec4 bifloor(vec4 z) { return floor(z); }
  vec4 biceil(vec4 z) { return ceil(z); }
  vec4 biround(vec4 z) { return floor(z + 0.5); }
  vec4 bistep(vec4 z) { return vec4(step(0.0, z.x), 0.0, 0.0, 0.0); }
  vec4 biclamp(vec4 z, vec4 w, vec4 s) { return vec4(clamp(z.x, w.x, s.y), clamp(z.y, w.y, s.y), clamp(z.z, w.z, s.z), clamp(z.w, w.w, s.w)); }
  //vec4 bi1arg(vec4 z) { vec2 u = cmul_i(bidiv(z.zw, z.xy)); vec2 arg = cmul_i(clog(bidiv(vec2(1.0, 0.0) - u, vec2(1.0, 0.0) + u))) * 0.5; return vec4(0.0, 0.0, arg.x, arg.y); }
  vec4 bifib(vec4 z) { return (bipow(vec4(1.61803398875, 0.0, 0.0, 0.0), z) - bipow(vec4(-0.61803398875, 0.0, 0.0, 0.0), z)) * 0.4472135955; }
  vec4 bitau(vec4 z, vec4 w) { return vec4(1.0, 0.0, 0.0, 0.0) - bipow(z, vec4(0.5, 0.0, 0.0, 0.0) - w); }
  vec4 bitau_derv(vec4 z, vec4 w) { return bimul(bipow(z, vec4(0.5, 0.0, 0.0, 0.0) - w), bilog(z)); }
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
  vec4 bigamma1(vec4 z) { return z.x < 0.5 ? bigamma_left(z) : bigamma_right(z); }
  vec4 bisqrt(vec4 z) { return bifromidempotent(csqrt(bitoidempotent_left(z)), csqrt(bitoidempotent_right(z))); }
  vec4 bidot(vec4 z, vec4 w) { return bimul(z, biconj(w)); }
  vec4 bisop(vec4 z, vec4 w) { return bidiv(z, biconj(w)); }
  vec4 bigamma(vec4 z) { return bifromidempotent(cgamma(bitoidempotent_left(z)), cgamma(bitoidempotent_right(z))); }
  vec4 bidigamma(vec4 z) { return bifromidempotent(cdigamma(bitoidempotent_left(z)), cdigamma(bitoidempotent_right(z))); }
  vec4 bigammasi(vec4 z) { return bifromidempotent(cgammasi(bitoidempotent_left(z)), cgammasi(bitoidempotent_right(z))); }
  vec4 bieta(vec4 z) { return bifromidempotent(ceta(bitoidempotent_left(z)), ceta(bitoidempotent_right(z))); }
  vec4 bizeta(vec4 z) { return bifromidempotent(czeta(bitoidempotent_left(z)), czeta(bitoidempotent_right(z))); }
  vec4 bibeta(vec4 z, vec4 w) { return bifromidempotent(cbeta(bitoidempotent_left(z), bitoidempotent_left(w)), cbeta(bitoidempotent_right(z), bitoidempotent_right(w))); }
  vec4 bisn(vec4 z, vec4 w) { return bifromidempotent(csn(bitoidempotent_left(z), bitoidempotent_left(w)), csn(bitoidempotent_right(z), bitoidempotent_right(w))); }
  vec4 bicn(vec4 z, vec4 w) { return bifromidempotent(ccn(bitoidempotent_left(z), bitoidempotent_left(w)), ccn(bitoidempotent_right(z), bitoidempotent_right(w))); }
  vec4 bidn(vec4 z, vec4 w) { return bifromidempotent(cdn(bitoidempotent_left(z), bitoidempotent_left(w)), cdn(bitoidempotent_right(z), bitoidempotent_right(w))); }
  vec4 biwp(vec4 z, vec4 w) { return bifromidempotent(cwp(bitoidempotent_left(z), bitoidempotent_left(w)), cwp(bitoidempotent_right(z), bitoidempotent_right(w))); }
  vec4 bisn_derv(vec4 z, vec4 w) { return bifromidempotent(csn_derv(bitoidempotent_left(z), bitoidempotent_left(w)), csn_derv(bitoidempotent_right(z), bitoidempotent_right(w))); }
  vec4 bicn_derv(vec4 z, vec4 w) { return bifromidempotent(ccn_derv(bitoidempotent_left(z), bitoidempotent_left(w)), ccn_derv(bitoidempotent_right(z), bitoidempotent_right(w))); }
  vec4 bidn_derv(vec4 z, vec4 w) { return bifromidempotent(cdn_derv(bitoidempotent_left(z), bitoidempotent_left(w)), cdn_derv(bitoidempotent_right(z), bitoidempotent_right(w))); }
  vec4 bipow_derv(vec4 z, float w) { return bipow(z, w - 1.0) * w; }
  vec4 bipow_derv(vec4 z, vec4 w) { return bimul(bipow(z, w - vec4(1.0, 0.0, 0.0, 0.0)), w); }
  vec4 bigamma_derv(vec4 z) { return bifromidempotent(cgamma_derv(bitoidempotent_left(z)), cgamma_derv(bitoidempotent_right(z))); }
  vec4 bizeta_derv(vec4 z) { return bifromidempotent(czeta_derv(bitoidempotent_left(z)), czeta_derv(bitoidempotent_right(z))); }
  vec4 bieta_derv(vec4 z) { return bifromidempotent(ceta_derv(bitoidempotent_left(z)), ceta_derv(bitoidempotent_right(z))); }
  vec4 biwp_derv(vec4 z, vec4 w) { return bifromidempotent(cwp_derv(bitoidempotent_left(z), bitoidempotent_left(w)), cwp_derv(bitoidempotent_right(z), bitoidempotent_right(w))); }

  float tabs(vec4 z) { return length(z); }
  vec4 tneg(vec4 z) { return z * -1.0; }
  vec4 tsq(vec4 z) {
    z.x = z.x + 0.00000001;
    float zxpow = z.x * z.x, zypow = z.y * z.y, zzpow = z.z * z.z;
    float zxypow = zxpow + zypow;
    float a = 1.0 - zzpow / zxypow;
    float y = 2.0 * z.y * z.x * a;
    float zz = 2.0 * z.z * sqrt(zxypow);
    float x = (zxpow - zypow) * a;
    return vec4(x, y, zz, z.w);
  }
  vec4 texp(vec4 z) { float cosphi = cos(z.z); return exp(z.x) * vec4(cosphi * cos(z.y), cosphi * sin(z.y), sin(z.z), z.w); }
  vec4 tlog(vec4 z) { float r = length(z); if (r < 1e-8) { return vec4(-18.42, 0.0, 0.0, 0.0); } float phi = asin(clamp(z.z / r, -1.0, 1.0)); return vec4(log(r), atan(z.y, z.x), phi, z.w); }
  vec4 tinv(vec4 z) { return texp(-1.0 * tlog(z)); }
  vec4 tadd(vec4 z, vec4 w) { return z + w; }
  vec4 tsub(vec4 z, vec4 w) { return z - w; }
  vec4 tmul(vec4 z, float w) { return z * w; }
  vec4 tmul(float z, vec4 w) { return z * w; }
  vec4 tsinh(vec4 z) { return (texp(z) - texp(-z)) * 0.5; }
  vec4 tcosh(vec4 z) { return (texp(z) + texp(-z)) * 0.5; }
  vec4 tmul(vec4 z, vec4 w) { return texp(tlog(z) + tlog(w)); }
  vec4 tpow(vec4 z, float w) { if (w == 1.0) { return z; } else if (w == 2.0) { return tsq(z); } return texp(w * tlog(z)); }
  vec4 tpow(vec4 z, vec4 w) { return tpow(z, w.x); }
  vec4 troot(vec4 z, float w) { return tpow(z, 1.0 / w); }
  vec4 tsqrt(vec4 z) { return texp(0.5 * tlog(z)); }
  vec4 ttaue(vec4 z) { return vec4(1.0, 0.0, 0.0, 0.0) - texp(vec4(0.5, 0.0, 0.0, 0.0) - z); }
  vec4 tsign(vec4 z) { return z / length(z); }
  vec4 tmax(vec4 z, vec4 w) { return vec4(max(z.x, w.x), max(z.y, w.y), min(z.z, w.z), min(z.w, w.w)); }
  vec4 tmin(vec4 z, vec4 w) { return vec4(min(z.x, w.x), min(z.y, w.y), min(z.z, w.z), min(z.w, w.w)); }
  vec4 trelumax(vec4 z) { return tmax(z, vec4(0.0, 0.0, 0.0, 0.0)); }
  vec4 trelumin(vec4 z) { return tmin(z, vec4(0.0, 0.0, 0.0, 0.0)); }
  vec4 tfloor(vec4 z) { return floor(z); }
  vec4 tceil(vec4 z) { return ceil(z); }
  vec4 tround(vec4 z) { return floor(z + 0.5); }
  vec4 tstep(vec4 z) { return vec4(step(0.0, z.x), 0.0, 0.0, 0.0); }
  vec4 tclamp(vec4 z, vec4 w, vec4 s) { return vec4(clamp(z.x, w.x, s.y), clamp(z.y, w.y, s.y), clamp(z.z, w.z, s.z), clamp(z.w, w.w, s.w)); }

  float bounce(float x, float min, float max) {
    float size = max - min;
    float offset = mod(x - min, 2.0 * size);
    return offset > size ? max - (offset - size) : min + offset;
  }

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 0.666666666667, 0.333333333333, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  vec3 hue(float h) {
    float angle = h * 0.0174532925199;
    float w = sin(angle);
    float u = cos(angle);
    vec3 ret;
    ret.x = 0.587 - 0.587 * u + 0.330 * w;
    ret.z = 0.587 - 0.587 * u - 1.050 * w;
    ret.y = 0.587 + 0.413 * u + 0.035 * w;
    return ret;
  }
`;

function mandelbrotshadercode(formula = "z = cpow(z, w) + c;", dervformula = "") {
return `void mandelbrot_calc() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
  vec2 c = ismandel == 1 ? uv * zoommandel + vec2(cxval, cyval) : vec2(cxval, cyval);
  if (inverse != 0.0) { c = cinvmix(c, inverse); }
  vec2 z = ismandel == 1 ? c : uv * zoomjulia + vec2(zxval, zyval);
  const int maxiter = 180;
  int iter = maxiter > iteration ? iteration : maxiter;
  float znorm = 0.0;
  int n = 0, maxn = iter;
  vec2 w = vec2(power, 0.0);
  vec2 z2 = vec2(0.0, 0.0);
  vec2 z0 = z, z_prev = z;
  for (int i = 0; i < maxiter; i++) {
    z_prev = z;
    znorm = dot(z, z);
    if (znorm > range) { n = i; break; }
    if (isburning == 1) { z.x = abs(z.x); z.y = -abs(z.y); }
    if (isconj == 1) { z.x = z.x; z.y = -z.y; }
    if (isminusone == 1) { z = vec2(1.0, 0.0) - z; }
    ` + formula + `
    n += 1;
    if (n >= maxn) { n = iter; break; }
  }
  if (colorschemeindex == 0) {
    float hue = (atan(z.y, z.x) * 0.159154943092 + 0.5);
    vec3 color1 = vec3(0.0, 0.0, 0.0);
    if (hue != 0.0) {
      float value = log(znorm + 1.0) * 0.5;
      color1 = hsv2rgb(vec3(hue, 0.8, clamp(value, 0.0, 1.0)));
    }
    gl_FragColor = vec4(color1, 1.0);
  } else if (colorschemeindex == 1) {
    float color = 0.0;
    if (n != 0 && n != iter) {
      float nu = log(log(znorm) * logval * 0.5) * logval;
      if (nu < float(n)) { color = float(n) - nu; }
    } else {
      color = n == iter ? 0.0 : float(n);
    }
    color *= 0.0078431372549 * multlight;
    float r = bounce(color, 0.0, 1.0);
    float g = bounce(color * 2.0, 0.0, 1.0);
    float b = bounce(color * 3.0, 0.0, 1.0);
    gl_FragColor = vec4(r, g, b, 1.0);
  } else if (colorschemeindex == 2) {
    float logMag = log(length(z) + 1.0);
    vec3 col = hsv2rgb(vec3(0.7 - logMag * 0.1, 0.7, clamp(logMag * 0.3, 0.0, 1.0)));
    gl_FragColor = vec4(col, 1.0);
  } else if (colorschemeindex == 3) {
    float hue = (atan(z.y, z.x) * 0.159154943092 + 0.5);
    vec3 col = hsv2rgb(vec3(hue, 0.8, 0.9));
    gl_FragColor = vec4(col, 1.0);
  }
} void main() { mandelbrot_calc(); }`;
}

function newtonshadercode(formula = "z = z_prev - cdiv(cpow(z, w) - vec2(1.0, 0.0), cmul(vec2(1.0, 0.0), cpow_derv(z, w))) + c;", formula2 = "") {
return `void newton_calc() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
  vec2 c = ismandel == 1 ? uv * zoommandel + vec2(cxval, cyval) : vec2(cxval, cyval);
  if (inverse != 0.0) { c = cinvmix(c, inverse); }
  vec2 z = ismandel == 1 ? c : uv * zoomjulia + vec2(zxval, zyval);
  const int maxiter = 220;
  float znorm = 0.0, rangeval = 1.0 / (500.0 * range);
  vec2 w = vec2(power, 0.0);
  vec2 p = vec2(-0.5, 0.0);
  vec2 z_prev = z, func = z, derv = vec2(1.0, 0.0);
  int n = 0, maxn = iteration;
  vec2 zpos = vec2(1.0, 0.0);
  for (int i = 0; i < maxiter; i++) {
    z_prev = z;
    //z = z_prev - cdiv(ccosh(cpow(z, w)) - vec2(0.0, 0.0), cmul(csinh(z), cpow_derv(z, w))) + c;
    //z = z_prev - cdiv(cpow(z, w) - zpos, cmul(vec2(1.0, 0.0), cpow_derv(z, w))) + c;
    ` + formula + `
    n += 1;
    znorm = dot(z - z_prev, z - z_prev);
    if (znorm < rangeval || n >= maxn) { z = z_prev; n = n >= maxn ? maxiter : i; break; }
  }
  if (colorschemeindex == 0) {
    float hue = (atan(z.y, z.x) * 0.159154943092 + 0.5);
    vec3 color1 = vec3(0.0, 0.0, 0.0);
    if (hue != 0.0) {
      float value = log((z.x * z.x + z.y * z.y) + 1.0) * 0.5;
      color1 = hsv2rgb(vec3(hue, 0.8, clamp(value, 0.0, 1.0)));
    }
    gl_FragColor = vec4(color1, 1.0);
  } else if (colorschemeindex == 1) {
    float color = n == iteration ? 0.0 : float(n);
    color *= 0.0078431372549 * multlight;
    float r = bounce(color, 0.0, 1.0);
    float g = bounce(color * 2.0, 0.0, 1.0);
    float b = bounce(color * 3.0, 0.0, 1.0);
    gl_FragColor = vec4(r, g, b, 1.0);
  } else if (colorschemeindex == 2) {
    float logMag = log(length(z) + 1.0);
    vec3 col = hsv2rgb(vec3(0.7 - logMag * 0.1, 0.7, clamp(logMag * 0.3, 0.0, 1.0)));
    gl_FragColor = vec4(col, 1.0);
  } else if (colorschemeindex == 3) {
    float hue = (atan(z.y, z.x) * 0.159154943092 + 0.5);
    vec3 col = hsv2rgb(vec3(hue, 0.8, 0.9));
    gl_FragColor = vec4(col, 1.0);
  }
} void main() { newton_calc(); }`;
}

let lyapunovshader = `void lyapunov_calc() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
  vec2 c = ismandel == 1 ? uv * zoommandel + vec2(cxval, cyval) : vec2(cxval, cyval);
  if (inverse != 0.0) { c = cinvmix(c, inverse); }
  vec2 z = ismandel == 1 ? c : uv * zoomjulia + vec2(zxval, zyval);
  const int maxiter = 180;
  float lambda = 0.0, maxlambda = 120000.0, xn = 0.5, rx = 0.0, ri = 0.0, invn = 1.0 / float(maxiter);
  int modval = 0, n0 = iteration / 10; // n0 > 1
  for (int i = 1; i < maxiter; i++) {
    modval = i - (i / 2) * 2;
    if (modval == 1) { rx = z.x; } // re 
    else if (modval == 0) { rx = z.y; } // im
    xn = logmap(rx, xn);
    if (i >= n0) { lambda += log(abs(logmap_derv(rx, xn))) * invn; }
    if (abs(lambda) > maxlambda || i - 2 == iteration) { break; }
  }
  if (lambda > 0.0) {
    ri = exp(-3.3 * lambda) * 25.5;
  }
  else {
    lambda = exp(lambda);
    ri = (lambda <= 0.98 ? lambda * 15.2653061226 : (1.76 + -37.0 * (0.98 - lambda)) * 8.5);
  }
  if (colorschemeindex == 0) {
    float hue = atan(rx, ri) * 0.159154943092 + 0.5;
    float value1 = log((rx * rx + ri * ri) + 1.0) * 0.5;
    vec3 color1 = hsv2rgb(vec3(hue, 0.8, clamp(value1, 0.0, 1.0)));
    gl_FragColor = vec4(color1, 1.0);
  } else if (colorschemeindex == 1) {
    float color = ri * multlight * 0.00392156862745 * 2.5;
    float r = bounce(color, 0.0, 1.0);
    float g = bounce(color * 2.0, 0.0, 1.0);
    float b = bounce(color * 3.0, 0.0, 1.0);
    gl_FragColor = vec4(r, g, b, 1.0);
  }
}

void main() { lyapunov_calc(); }`;

function raymarchingsharecode(func1, func2) {
  return `void mandel3d_calc() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
  vec3 ro = vec3(ismandel == 1 ? cxval : zxval, ismandel == 1 ? cyval : zyval, ismandel == 1 ? -zoommandel : -zoomjulia);
  vec3 rd = normalize(vec3(uv.x, uv.y, 1.0));
  float rozy = cosrotx * ro.z - sinrotx * ro.y;
  float cy = cosrotx * ro.y + sinrotx * ro.z;
  float cx = cosrotz * ro.x + sinrotz * rozy;
  float cz = cosrotz * rozy - sinrotz * ro.x;
  float cw = zwval;
  if (inverse != 0.0) {
    float cnorminv = 1.0 / (cx * cx + cy * cy + cz * cz + cw * cw) * inverse;
    cx = cx * cnorminv + (1.0 - inverse) * cx;
    cy = cy * cnorminv + (1.0 - inverse) * cy;
    cz = cz * cnorminv + (1.0 - inverse) * cz;
    cw = cw * cnorminv + (1.0 - inverse) * cw;
  }
  float zx = ismandel == 1 ? cx : cxval;
  float zy = ismandel == 1 ? cy : cyval;
  float zz = ismandel == 1 ? cz : zoommandel;
  float zw = ismandel == 1 ? cw : cwval;
  float surDist = 0.1, val = 0.0, dO = 0.0, maxDist = 100.0, cpreinv = 0.0;
  const int raymarch_iterations = 100;
  int ot = raymarch_iterations - 1;
  ` + func1 + `
  for(int i = 0; i < raymarch_iterations; i++) {
    vec2 dist = vec2(0, 0);
    float px = ro.x + rd.x * dO;
    float py = ro.y + rd.y * dO;
    float pz = ro.z + rd.z * dO;
    zy = cosrotx * py + sinrotx * pz;
    zz = cosrotx * pz - sinrotx * py;
    zx = cosrotz * px + sinrotz * zz;
    zz = cosrotz * zz - sinrotz * px;
    if (inverse != 0.0) {
      cpreinv = zx * zx + zy * zy + zz * zz + zw * zw;
      float cnorminv = inverse / cpreinv;
      zx = zx * cnorminv + (1.0 - inverse) * zx;
      zy = zy * cnorminv + (1.0 - inverse) * zy;
      zz = zz * cnorminv + (1.0 - inverse) * zz;
      zw = zw * cnorminv + (1.0 - inverse) * zw;
    }
    cx = ismandel == 1 ? zx : cxval;
    cy = ismandel == 1 ? zy : cyval;
    cz = ismandel == 1 ? zz : zoommandel;
    cw = ismandel == 1 ? zw : cwval;
    ` + func2 + `
    if (inverse != 0.0) { dist.x *= mix(1.0, cpreinv, inverse); }
    dO += dist.x;
    if (dist.x < surDist) { ot = i; val = dist.y; break;}
    if (dO > maxDist) { ot = 0; break; }
  }
  if (colorschemeindex == 0) {
    vec3 col = vec3(0.0, 0.0, 0.0);
    if (ot != 0) {
      float bright = 1.0 - 1.5 * float(ot) / float(raymarch_iterations);
      col = hue(1.0 + clamp(val, 3.0, 20.0) * 80.0) * bright * multlight;
    }
    gl_FragColor = vec4(col.x, col.y, col.z, 1.0);
  } else if (colorschemeindex == 1) {
    vec3 col = mix(vec3(0.05, 0.1, 0.2), vec3(0.9, 0.5, 0.2), clamp(val / 25.0, 0.0, 1.0));
    float fog = exp(float(ot) / float(raymarch_iterations) * -2.5);
    col *= fog;
    col += vec3(0.1, 0.2, 0.4) * (1.0 - fog) * 0.3;
    gl_FragColor = vec4(col, 1.0);
  }
}`;
}

let mandelboxshader = `vec2 mandelbox(float zx, float zy, float zz, float zw, float cx, float cy, float cz, float cw) {
  int n = 0;
  float dr = 1.0, znorm = 0.0, scale = -2.0, fixedRadius = 1.0, minRadius = 0.5, foldingLimit = 1.0, p = -0.5;
  float fixedRadius2 = fixedRadius * fixedRadius, minRadius2 = minRadius * minRadius;
  vec3 z = vec3(zx, zy, zz);
  vec3 c = vec3(cx, cy, cz);
  vec3 z0 = z, z_prev = z;
  for (int i = 0; i < 20; i++) {
    z_prev = z;
    n = i;
    if (isburning == 1) { z.x = abs(z.x); z.y = -abs(z.y); z.z = -abs(z.z); }
    z = (clamp(z, -foldingLimit, foldingLimit) * 2.0 - z); //z = clamp(z, -foldingLimit, foldingLimit); z = z * 2.0 - z;
    float r2 = dot(z, z);
    if (r2 < minRadius2) {
      float temp = fixedRadius2 / minRadius2; // float temp = fixedRadius2 / minRadius
      z *= temp;
      dr *= temp;
    } else if (r2 < fixedRadius2) {
      float temp = fixedRadius2 / r2;
      z *= temp;
      dr *= temp;
    }
    z = z * scale + c;
    dr = dr * abs(scale) + 1.0;
    if (dot(z, z) > range * 140.0) { break; }
  }
  return vec2(length(z) / abs(dr) * 0.25, float(n));
}
` + raymarchingsharecode("surDist = mandelbox(zx, zy, zz, zw, cx, cy, cz, cw).x * 0.001;", "dist = mandelbox(zx, zy, zz, zw, cx, cy, cz, cw);") + ' void main() { mandel3d_calc(); }';

function mandelbulbshadercode(formula = "z = tpow(z, w) + c;", dervformula = "vec4 derv = tpow(z_prev, power - 1.0) * power;", iteration = 12) {
  return `vec2 mandelbulb(float zx, float zy, float zz, float zw, float cx, float cy, float cz, float cw) {
    int n = 0;
    float dr = 1.0, znorm = 0.0;
    vec4 z = vec4(zx, zy, zz, zw);
    vec4 c = vec4(cx, cy, cz, cw);
    float w = power;
    vec4 z0 = z, z_prev = z, derv = z;
    for (int i = 0; i < ` + iteration + `; i++) {
      z_prev = z;
      znorm = length(z);
      n = i;
      if (znorm > range) { break; }
      if (isburning == 1) { z = v4abs(z); }
      if (isconj == 1) { z = v4conj(z); }
      if (isminusone == 1) { z = vec4(1.0, 0.0, 0.0, 0.0) - z; }
      ` + dervformula + `
      dr = length(derv) * dr + 1.0;
      ` + formula + `
      //dr = pow_derv(znorm, power) * dr + 1.0;
    }
    znorm = length(z);
    return vec2(0.5 * log(znorm) * znorm / dr, n);
  }
  ` + raymarchingsharecode("surDist = mandelbulb(zx, zy, zz, zw, cx, cy, cz, cw).x * 0.001;", "dist = mandelbulb(zx, zy, zz, zw, cx, cy, cz, cw);") + ' void main() { mandel3d_calc(); }';
}

function quaternionshadercode(formula = "z = qpow(z, w) + c;", dervformula = "vec4 derv = qpow(z_prev, power - 1.0) * power;", iteration = 12) {
  return `vec2 mandel_quaternion(float zx, float zy, float zz, float zw, float cx, float cy, float cz, float cw) {
    int n = 0;
    float dr = 1.0, znorm = 0.0;
    vec4 z = vec4(zx, zy, zz, zw);
    vec4 c = vec4(cx, cy, cz, cw);
    vec4 w = vec4(power, 0.0, 0.0, 0.0);
    vec4 z0 = z, z_prev = z, derv = z;
    for (int i = 0; i < ` + iteration + `; i++) {
      z_prev = z;
      znorm = length(z);
      n = i;
      if (znorm > range) { break; }
      if (isburning == 1) { z = v4abs(z); }
      if (isconj == 1) { z = v4conj(z); }
      if (isminusone == 1) { z = vec4(1.0, 0.0, 0.0, 0.0) - z; }
      ` + dervformula + `
      dr = length(derv) * dr + 1.0;
      ` + formula + `
    }
    znorm = length(z);
    return vec2(0.5 * log(znorm) * znorm / dr, n);
  }
  ` + raymarchingsharecode("surDist = mandel_quaternion(zx, zy, zz, zw, cx, cy, cz, cw).x * 0.001;", "dist = mandel_quaternion(zx, zy, zz, zw, cx, cy, cz, cw);") + ' void main() { mandel3d_calc(); }';
}

function bicomplexshadercode(formula = "z = bipow(z, w) + c;", dervformula = "vec4 derv = bipow(z_prev, power - 1.0) * power;", iteration = 12) {
  return `vec2 mandel_bicomplex(float zx, float zy, float zz, float zw, float cx, float cy, float cz, float cw) {
    int n = 0;
    float dr = 1.0, znorm = 0.0;
    vec4 z = vec4(zx, zy, zz, zw);
    vec4 c = vec4(cx, cy, cz, cw);
    vec4 w = vec4(power, 0.0, 0.0, 0.0);
    vec4 z0 = z, z_prev = z, derv = z;
    for (int i = 0; i < ` + iteration + `; i++) {
      z_prev = z;
      znorm = length(z);
      n = i;
      if (znorm > range) { break; }
      if (isburning == 1) { z = v4abs(z); }
      if (isconj == 1) { z = v4conj(z); }
      if (isminusone == 1) { z = vec4(1.0, 0.0, 0.0, 0.0) - z; }
      ` + dervformula + `
      dr = length(derv) * dr + 1.0;
      ` + formula + `
    }
    znorm = length(z);
    return vec2(0.5 * log(znorm) * znorm / dr, n);
  }
  ` + raymarchingsharecode("surDist = mandel_bicomplex(zx, zy, zz, zw, cx, cy, cz, cw).x * 0.001;", "dist = mandel_bicomplex(zx, zy, zz, zw, cx, cy, cz, cw);") + ' void main() { mandel3d_calc(); }';
}

let bicomplexnewtonshader = `vec2 newton_bicomplex(float zx, float zy, float zz, float zw, float cx, float cy, float cz, float cw) {
  int n = 0;
  vec4 z = vec4(zx, zy, zz, zw);
  vec4 w = vec4(power, 0.0, 0.0, 0.0);
  vec4 w_minus_1 = vec4(power - 1.0, 0.0, 0.0, 0.0);
  vec4 w_minus_2 = vec4(power - 2.0, 0.0, 0.0, 0.0);
  vec4 dz = vec4(1.0, 0.0, 0.0, 0.0);
  for (int i = 0; i < 25; i++) {
    n = i;
    vec4 f_z = bipow(z, w) - vec4(1.0, 0.0, 0.0, 0.0);
    vec4 df_z = bimul(w, bipow(z, w_minus_1));
    vec4 ddf_z = bimul(bimul(w, w_minus_1), bipow(z, w_minus_2));
    vec4 df_inv = biinv(df_z);
    vec4 delta = bimul(df_inv, f_z);
    dz = bimul(dz, bimul(bimul(f_z, ddf_z), bimul(df_inv, df_inv)));
    z = z - delta;
    if (length(delta) < 0.001) { break; }
  }
  float zabs = length(z);
  float dist = zabs * log(max(zabs, 1.0001)) / max(length(dz), 0.0001);
  return vec2(clamp(dist * 0.5, 0.0, 1.0), float(n));
}
` + raymarchingsharecode("surDist = newton_bicomplex(zx, zy, zz, zw, cx, cy, cz, cw).x * 0.001;", "dist = newton_bicomplex(zx, zy, zz, zw, cx, cy, cz, cw);") + ' void main() { mandel3d_calc(); }';

function getDerivative(f, v = 'z') {
  const F = ["add","sub","mul","div","pow","root","neg","inv","log","exp","gamma","zeta","eta","beta","sinh","cosh","tanh","coth","sin","cos","tan","cot","tau","gammasi","fib","sn","cn","dn","wp","abs","arg","conj","sign","floor","ceil","round","max","min","relumax","relumin","step","clamp","sq","sqrt","dot","sop"];
  const D = ["gamma","zeta","eta","beta","tau","gammasi","fib","sn","cn","dn","wp"];
  const T = f.match(/\d+(?:\.\d+)?|[a-zA-Z_]\w*|[()+\-/*^,]/g) || [];
  let p = 0;
  const pk = () => T[p];
  const nx = () => T[p++];

  const parseExpr = () => {
      let l = parseTerm();
      while (pk() === '+' || pk() === '-') {
          const o = nx();
          l = { t: 'b', o, l, r: parseTerm() };
      }
      return l;
  };
  const parseTerm = () => {
      let l = parseUnary();
      while (pk() === '*' || pk() === '/') {
          const o = nx();
          l = { t: 'b', o, l, r: parseUnary() };
      }
      return l;
  };
  const parseUnary = () => {
      if (pk() === '-') { nx(); return { t: 'u', o: '-', c: parsePower() }; }
      if (pk() === '+') { nx(); return parsePower(); }
      return parsePower();
  };
  const parsePower = () => {
      let l = parsePrim();
      if (pk() === '^') {
          nx();
          const r = parsePower(); 
          l = { t: 'f', n: 'pow', a: [l, r] };
      }
      return l;
  };
  const parsePrim = () => {
      const tk = nx();
      if (tk === '(') { const e = parseExpr(); nx(); return e; }
      if (/^\d/.test(tk)) return { t: 'n', v: tk };
      if (F.includes(tk) && pk() === '(') {
          nx();
          const a = [parseExpr()];
          while (pk() === ',') { nx(); a.push(parseExpr()); }
          nx();
          return { t: 'f', n: tk, a };
      }
      return { t: 'v', n: tk };
  };

  const isConst = (node) => {
      if (node.t === 'n' || (node.t === 'v' && node.n !== v)) return true;
      if (node.t === 'b') return isConst(node.l) && isConst(node.r);
      if (node.t === 'u') return isConst(node.c);
      if (node.t === 'f') return node.a.every(isConst);
      return false;
  };

  const simplify = (node) => {
      if (!node) return { t: 'n', v: '0' };
      if (node.t === 'n' || node.t === 'v') return node;

      if (node.t === 'u') {
          let c = simplify(node.c);
          if (c.t === 'n') return { t: 'n', v: String(-parseFloat(c.v)) };
          if (c.t === 'u' && c.o === '-') return c.c;
          return { t: 'u', o: '-', c };
      }

      if (node.t === 'f') {
          let args = node.a.map(simplify);
          if (args.every(a => a.t === 'n')) {
              let val = parseFloat(args[0].v);
              let res = 0;
              try {
                  if (node.n === 'sin') res = Math.sin(val);
                  else if (node.n === 'cos') res = Math.cos(val);
                  else if (node.n === 'exp') res = Math.exp(val);
                  else if (node.n === 'log') res = Math.log(val);
                  else if (node.n === 'sqrt') res = Math.sqrt(val);
                  else if (node.n === 'sq') res = val * val;
                  else if (node.n === 'inv') res = 1 / val;
                  else if (node.n === 'neg') res = -val;
                  else if (node.n === 'abs') res = Math.abs(val);
                  if (isFinite(res)) return { t: 'n', v: String(res) };
              } catch(e) {}
          }
          return { t: 'f', n: node.n, a: args };
      }
      if (node.t === 'b') {
          let l = simplify(node.l);
          let r = simplify(node.r);
          let o = node.o;
          if (l.t === 'n' && r.t === 'n') {
              let lv = parseFloat(l.v), rv = parseFloat(r.v);
              let res = o==='+' ? lv+rv : o==='-' ? lv-rv : o==='*' ? lv*rv : lv/rv;
              if (isFinite(res)) return { t: 'n', v: String(res) };
          }
          if (o === '+') {
              if (l.t === 'n' && parseFloat(l.v) === 0) return r;
              if (r.t === 'n' && parseFloat(r.v) === 0) return l;
          }
          if (o === '-') {
              if (r.t === 'n' && parseFloat(r.v) === 0) return l;
              if (l.t === 'n' && parseFloat(l.v) === 0) return { t: 'u', o: '-', c: r };
          }
          if (o === '*') {
              if ((l.t === 'n' && parseFloat(l.v) === 0) || (r.t === 'n' && parseFloat(r.v) === 0)) return { t: 'n', v: '0' };
              if (l.t === 'n' && parseFloat(l.v) === 1) return r;
              if (r.t === 'n' && parseFloat(r.v) === 1) return l;
              if (l.t === 'n' && parseFloat(l.v) === -1) return { t: 'u', o: '-', c: r };
              if (r.t === 'n' && parseFloat(r.v) === -1) return { t: 'u', o: '-', c: l };
              if (JSON.stringify(l) === JSON.stringify(r)) return { t: 'f', n: 'sq', a: [l] };
          }
          if (o === '/') {
              if (l.t === 'n' && parseFloat(l.v) === 0) return { t: 'n', v: '0' };
              if (r.t === 'n' && parseFloat(r.v) === 1) return l;
              if (r.t === 'n' && parseFloat(r.v) === -1) return { t: 'u', o: '-', c: l };
              if (l.t === 'n' && parseFloat(l.v) === 1) return { t: 'f', n: 'inv', a: [r] };
              if (l.t === 'u' && l.o === '-' && l.c.t === 'n' && parseFloat(l.c.v) === 1) {
                  return { t: 'f', n: 'neg', a: [{ t: 'f', n: 'inv', a: [r] }] };
              }
              if (JSON.stringify(l) === JSON.stringify(r)) return { t: 'n', v: '1' };
          }
          return { t: 'b', o, l, r };
      }
      return node;
  };

  const diff = (node) => {
      if (node.t === 'n') return { t: 'n', v: '0' };
      if (node.t === 'v') return { t: 'n', v: node.n === v ? '1' : '0' };
      if (node.t === 'u') return simplify({ t: 'u', o: '-', c: diff(node.c) });
      
      if (node.t === 'b') {
          const { o, l, r } = node;
          const dl = diff(l), dr = diff(r);
          if (o === '+') return simplify({ t: 'b', o: '+', l: dl, r: dr });
          if (o === '-') return simplify({ t: 'b', o: '-', l: dl, r: dr });
          if (o === '*') return simplify({ t: 'b', o: '+', l: { t: 'b', o: '*', l: dl, r }, r: { t: 'b', o: '*', l, r: dr } });
          if (o === '/') return simplify({ t: 'b', o: '/', l: { t: 'b', o: '-', l: { t: 'b', o: '*', l: dl, r }, r: { t: 'b', o: '*', l, r: dr } }, r: { t: 'b', o: '*', l: r, r } });
      }
      
      if (node.t === 'f') {
          const { n, a } = node;
          const f = a[0], df = diff(f);
          const m = (o, l, r) => ({ t: 'b', o, l, r });
          const c = (val) => ({ t: 'n', v: val });
          const fn = (name, args) => ({ t: 'f', n: name, a: args });
          let od = null;

          if (n === 'pow') {
              if (isConst(a[1])) od = m('*', m('*', a[1], fn('pow', [a[0], m('-', a[1], c('1'))])), df);
              else if (isConst(a[0])) od = m('*', m('*', fn('pow', a), fn('log', [a[0]])), diff(a[1]));
              else od = m('*', fn('pow', a), m('+', m('*', diff(a[1]), fn('log', [a[0]])), m('/', m('*', a[1], diff(a[0])), a[0])));
          }
          else if (n === 'inv') od = simplify(m('/', fn('neg', [df]), fn('sq', [a[0]])));
          else if (n === 'sqrt') od = m('/', df, m('*', c('2'), fn('sqrt', [a[0]])));
          else if (n === 'sq') od = m('*', c('2'), m('*', a[0], df));
          else if (n === 'exp') od = m('*', fn('exp', [a[0]]), df);
          else if (n === 'log') od = m('/', df, a[0]);
          else if (n === 'sin') od = m('*', fn('cos', [a[0]]), df);
          else if (n === 'cos') od = fn('neg', [m('*', fn('sin', [a[0]]), df)]);
          else if (n === 'tan') od = m('/', df, fn('sq', [fn('cos', [a[0]])]));
          else if (n === 'cot') od = fn('neg', [m('/', df, fn('sq', [fn('sin', [a[0]])]))]);
          else if (n === 'sinh') od = m('*', fn('cosh', [a[0]]), df);
          else if (n === 'cosh') od = m('*', fn('sinh', [a[0]]), df);
          else if (n === 'tanh') od = m('*', m('-', c('1'), fn('sq', [fn('tanh', [a[0]])])), df);
          else if (n === 'coth') od = fn('neg', [m('*', m('-', c('1'), fn('sq', [fn('coth', [a[0]])])), df)]);
          else if (n === 'abs') od = m('*', fn('sign', [a[0]]), df);
          else if (D.includes(n)) od = m('*', fn(n + '_derv', a), df);
          else od = c('0');

          return simplify(od);
      }
      return { t: 'n', v: '0' };
  };

  const str = (node, pr = 0) => {
      if (node.t === 'n') return node.v;
      if (node.t === 'v') return node.n;
      if (node.t === 'u') return `-${str(node.c, 3)}`;
      if (node.t === 'b') {
          const p = node.o === '*' || node.o === '/' ? 2 : 1;
          const l = str(node.l, p);
          const r = str(node.r, p + (node.o === '-' || node.o === '/' ? 0.5 : 0));
          const s = `${l} ${node.o} ${r}`;
          return p < pr ? `(${s})` : s;
      }
      if (node.t === 'f') return `${node.n}(${node.a.map(x => str(x, 0)).join(', ')})`;
      return '0';
  };

  return str(simplify(diff(parseExpr())));
}

function convertformulatowebgl(f, vecf = "vec2") {
  const T = f.match(/\d+(?:\.\d+)?|[a-zA-Z_]\w*|[()+\-/*^,]/g) || [];
  let p = 0;
  const pk = () => T[p], nx = () => T[p++];
  const pE = () => { let l = pT(); while (pk() === '+' || pk() === '-') { const o = nx(); l = { t: 'b', o, l, r: pT() }; } return l; };
  const pT = () => { let l = pU(); while (pk() === '*' || pk() === '/') { const o = nx(); l = { t: 'b', o, l, r: pU() }; } return l; };
  const pU = () => { if (pk() === '-') { nx(); return { t: 'u', o: '-', c: pPow() }; } if (pk() === '+') { nx(); return pPow(); } return pPow(); };
  const pPow = () => { let l = pP(); if (pk() === '^') { nx(); l = { t: 'f', n: 'pow', a: [l, pPow()] }; } return l; };
  const pP = () => {
      const tk = nx();
      if (tk === '(') { const e = pE(); nx(); return e; }
      if (/^\d/.test(tk)) return { t: 'n', v: parseFloat(tk) };
      if (pk() === '(') {
          nx(); const a = [pE()];
          while (pk() === ',') { nx(); a.push(pE()); }
          nx(); return { t: 'f', n: tk, a };
      }
      return { t: 'v', n: tk };
  };

  let ast = pE();
  
  const fmt = (v) => {
      let n = parseFloat(v);
      if (Number.isInteger(n)) return n.toFixed(1);
      return String(n);
  };

  const glslFuncs = {
      'sin': 'sin', 'cos': 'cos', 'tan': 'tan', 'exp': 'exp', 'log': 'log', 
      'sqrt': 'sqrt', 'abs': 'abs', 'pow': 'pow',
      'sinh': 'sinh', 'cosh': 'cosh', 'tanh': 'tanh',
      'inv': 'inv', 'neg': 'neg',
      'sq': (args) => `mul(${args[0]}, ${args[0]})`, 
      'cot': (args) => `inv(tan(${args[0]}))`, 
      'coth': (args) => `inv(tanh(${args[0]}))`
  };

  const isScalarConst = (node) => {
      return node.t === 'n' || (node.t === 'u' && node.c.t === 'n');
  };

  const str = (n, pr = 0, ctx = 'top') => {
      if (n.t === 'v') return n.n;
      if (n.t === 'n') {
        if (ctx === 'mul' || ctx === 'div') return fmt(n.v);
        if (vecf == "vec4") { return `vec4(${fmt(n.v)}, 0.0, 0.0, 0.0)`; }
        if (vecf == "vec3") { return `vec3(${fmt(n.v)}, 0.0, 0.0)`; }
        if (vecf == "vec1") { return `${fmt(n.v)}`; }
        return `vec2(${fmt(n.v)}, 0.0)`;
      }
      
      if (n.t === 'u') {
          if ((ctx === 'mul' || ctx === 'div') && n.c.t === 'n') {
              return `-${fmt(n.c.v)}`;
          }
          return `-${str(n.c, 3, ctx)}`; 
      }
      
      if (n.t === 'f') {
          let args = n.a.map(x => str(x, 0, 'func'));
          if (typeof glslFuncs[n.n] === 'function') return glslFuncs[n.n](args);
          return `${glslFuncs[n.n] || n.n}(${args.join(', ')})`;
      }
      
      if (n.t === 'b') {
          const { o, l, r } = n;
          
          if (o === '*' || o === '/') {
              const lIsConst = isScalarConst(l);
              const rIsConst = isScalarConst(r);
              
              if (lIsConst || rIsConst) {
                  const lS = str(l, 2, 'mul');
                  const rS = str(r, 2, o === '/' ? 'div' : 'mul');
                  if (o === '/') return `${lS} * inv(${rS})`;
                  return `${lS} * ${rS}`;
              } else {
                  const lS = str(l, 0, 'mul');
                  const rS = str(r, 0, o === '/' ? 'div' : 'mul');
                  if (o === '/') return `mul(${lS}, inv(${rS}))`;
                  return `mul(${lS}, ${rS})`;
              }
          }
          
          if (o === '+' || o === '-') {
              const p = 1;
              const lS = str(l, p, 'add');
              const rS = str(r, p + (o === '-' ? 0.5 : 0), 'add');
              const s = `${lS} ${o} ${rS}`;
              return p < pr ? `(${s})` : s;
          }
      }
      return vecf + '(0.0)';
  };
  
  return str(ast);
}

function getformula_and_derv(formula, vecf) {
  const newformula = convertformulatowebgl(formula, vecf);
  const dervformula = convertformulatowebgl(getDerivative(formula), vecf);
  return [newformula, dervformula];
}

function getfractal(formula, type, iteration) {
  function convertformula(formula, addtag = "c") {
    const functionlist = ["add", "sub", "mul", "div", "pow", "root", "neg", "inv", "log", "exp", "gamma", "zeta", "eta", "beta", "sinh", "cosh", "tanh", "coth", "sin", "cos", "tan", "cot", "tau", "gammasi", "fib", "sn", "cn", "dn", "wp", "abs", "arg", "conj", "sign", "floor", "ceil", "round", "max", "min", "relumax", "relumin", "step", "clamp", "sq", "sqrt", "dot", "sop",
     "gamma_derv", "zeta_derv", "eta_derv", "beta_derv", "tau_derv", "gammasi_derv", "fib_derv", "sn_derv", "cn_derv", "dn_derv", "wp_derv" ];
    let newFormula = formula;
    for (let i = 0; i < functionlist.length; i++) {
      const func = functionlist[i];
      newFormula = newFormula.replace(new RegExp('\\b' + func + '\\b', 'g'), addtag + func);
    }
    return newFormula;
  }
  if (type != "c" && formula != "z^(2 * w) + c") { iteration = parseInt(iteration > 4 ? iteration / 3 : iteration); }
  if (type != "c" && (formula.includes("gamma") || formula.includes("eta"))) { iteration = parseInt(iteration > 2 ? iteration / 5 : iteration / 1.25) + 1; }
  if (type != "c" && (formula.includes("eta(-z") && formula.includes("eta(z") || formula.includes("sn(") || formula.includes("dn(") || formula.includes("cn(") || formula.includes("wp("))) { iteration = parseInt(iteration > 2 ? iteration / 25 : iteration / 25) + 1; }  
  if (type == "bi") { const formulas = getformula_and_derv(formula, "vec4"); return bicomplexshadercode(convertformula("z = " + formulas[0], "bi") + ";", convertformula("derv = "  + formulas[1], "bi") + ";", iteration); }
  else if (type == "q") { const formulas = getformula_and_derv(formula, "vec4"); return quaternionshadercode(convertformula("z = " + formulas[0], "q") + ";", convertformula("derv = "  + formulas[1], "q") + ";", iteration); }
  else if (type == "t") { const formulas = getformula_and_derv(formula, "vec4"); return mandelbulbshadercode(convertformula("z = " + formulas[0], "t") + ";", convertformula("derv = "  + formulas[1], "t") + ";", iteration); }
  const formulas = getformula_and_derv(formula);
  return mandelbrotshadercode(convertformula("z = " + formulas[0], "c") + ";");
}
