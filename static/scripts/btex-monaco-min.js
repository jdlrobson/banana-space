define("monaco-editor", ["exports", "vs/editor/editor.main"], function (e, o) {
  Object.assign(e, o);
}),
  define("diff", ["exports"], function (e) {
    "use strict";
    function o() {}
    function t(e, o, t, n, r) {
      for (var i = 0, d = o.length, m = 0, a = 0; i < d; i++) {
        var l = o[i];
        if (l.removed) {
          if (
            ((l.value = e.join(n.slice(a, a + l.count))),
            (a += l.count),
            i && o[i - 1].added)
          ) {
            var s = o[i - 1];
            (o[i - 1] = o[i]), (o[i] = s);
          }
        } else {
          if (!l.added && r) {
            var u = t.slice(m, m + l.count);
            (u = u.map(function (e, o) {
              var t = n[a + o];
              return t.length > e.length ? t : e;
            })),
              (l.value = e.join(u));
          } else l.value = e.join(t.slice(m, m + l.count));
          (m += l.count), l.added || (a += l.count);
        }
      }
      var g = o[d - 1];
      return (
        d > 1 &&
          "string" == typeof g.value &&
          (g.added || g.removed) &&
          e.equals("", g.value) &&
          ((o[d - 2].value += g.value), o.pop()),
        o
      );
    }
    o.prototype = {
      diff: function (e, o) {
        var n =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
          r = n.callback;
        "function" == typeof n && ((r = n), (n = {})), (this.options = n);
        var i = this;
        function d(e) {
          return r
            ? (setTimeout(function () {
                r(void 0, e);
              }, 0),
              !0)
            : e;
        }
        (e = this.castInput(e)),
          (o = this.castInput(o)),
          (e = this.removeEmpty(this.tokenize(e)));
        var m = (o = this.removeEmpty(this.tokenize(o))).length,
          a = e.length,
          l = 1,
          s = m + a,
          u = [{ newPos: -1, components: [] }],
          g = this.extractCommon(u[0], o, e, 0);
        if (u[0].newPos + 1 >= m && g + 1 >= a)
          return d([{ value: this.join(o), count: o.length }]);
        function c() {
          for (var n = -1 * l; n <= l; n += 2) {
            var r = void 0,
              s = u[n - 1],
              g = u[n + 1],
              c = (g ? g.newPos : 0) - n;
            s && (u[n - 1] = void 0);
            var M = s && s.newPos + 1 < m,
              f = g && 0 <= c && c < a;
            if (M || f) {
              if (
                (!M || (f && s.newPos < g.newPos)
                  ? ((r = {
                      newPos: (h = g).newPos,
                      components: h.components.slice(0),
                    }),
                    i.pushComponent(r.components, void 0, !0))
                  : ((r = s).newPos++,
                    i.pushComponent(r.components, !0, void 0)),
                (c = i.extractCommon(r, o, e, n)),
                r.newPos + 1 >= m && c + 1 >= a)
              )
                return d(t(i, r.components, o, e, i.useLongestToken));
              u[n] = r;
            } else u[n] = void 0;
          }
          var h;
          l++;
        }
        if (r)
          !(function e() {
            setTimeout(function () {
              if (l > s) return r();
              c() || e();
            }, 0);
          })();
        else
          for (; l <= s; ) {
            var M = c();
            if (M) return M;
          }
      },
      pushComponent: function (e, o, t) {
        var n = e[e.length - 1];
        n && n.added === o && n.removed === t
          ? (e[e.length - 1] = { count: n.count + 1, added: o, removed: t })
          : e.push({ count: 1, added: o, removed: t });
      },
      extractCommon: function (e, o, t, n) {
        for (
          var r = o.length, i = t.length, d = e.newPos, m = d - n, a = 0;
          d + 1 < r && m + 1 < i && this.equals(o[d + 1], t[m + 1]);

        )
          d++, m++, a++;
        return a && e.components.push({ count: a }), (e.newPos = d), m;
      },
      equals: function (e, o) {
        return this.options.comparator
          ? this.options.comparator(e, o)
          : e === o ||
              (this.options.ignoreCase && e.toLowerCase() === o.toLowerCase());
      },
      removeEmpty: function (e) {
        for (var o = [], t = 0; t < e.length; t++) e[t] && o.push(e[t]);
        return o;
      },
      castInput: function (e) {
        return e;
      },
      tokenize: function (e) {
        return e.split("");
      },
      join: function (e) {
        return e.join("");
      },
    };
    var n = new o();
    function r(e, o) {
      if ("function" == typeof e) o.callback = e;
      else if (e) for (var t in e) e.hasOwnProperty(t) && (o[t] = e[t]);
      return o;
    }
    var i = /^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/,
      d = /\S/,
      m = new o();
    (m.equals = function (e, o) {
      return (
        this.options.ignoreCase &&
          ((e = e.toLowerCase()), (o = o.toLowerCase())),
        e === o || (this.options.ignoreWhitespace && !d.test(e) && !d.test(o))
      );
    }),
      (m.tokenize = function (e) {
        for (
          var o = e.split(/([^\S\r\n]+|[()[\]{}'"\r\n]|\b)/), t = 0;
          t < o.length - 1;
          t++
        )
          !o[t + 1] &&
            o[t + 2] &&
            i.test(o[t]) &&
            i.test(o[t + 2]) &&
            ((o[t] += o[t + 2]), o.splice(t + 1, 2), t--);
        return o;
      });
    var a = new o();
    function l(e, o, t) {
      return a.diff(e, o, t);
    }
    a.tokenize = function (e) {
      var o = [],
        t = e.split(/(\n|\r\n)/);
      t[t.length - 1] || t.pop();
      for (var n = 0; n < t.length; n++) {
        var r = t[n];
        n % 2 && !this.options.newlineIsToken
          ? (o[o.length - 1] += r)
          : (this.options.ignoreWhitespace && (r = r.trim()), o.push(r));
      }
      return o;
    };
    var s = new o();
    s.tokenize = function (e) {
      return e.split(/(\S.+?[.!?])(?=\s+|$)/);
    };
    var u = new o();
    function g(e) {
      return (g =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (e) {
              return typeof e;
            }
          : function (e) {
              return e &&
                "function" == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? "symbol"
                : typeof e;
            })(e);
    }
    function c(e) {
      return (
        (function (e) {
          if (Array.isArray(e)) return M(e);
        })(e) ||
        (function (e) {
          if ("undefined" != typeof Symbol && Symbol.iterator in Object(e))
            return Array.from(e);
        })(e) ||
        (function (e, o) {
          if (!e) return;
          if ("string" == typeof e) return M(e, o);
          var t = Object.prototype.toString.call(e).slice(8, -1);
          "Object" === t && e.constructor && (t = e.constructor.name);
          if ("Map" === t || "Set" === t) return Array.from(e);
          if (
            "Arguments" === t ||
            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
          )
            return M(e, o);
        })(e) ||
        (function () {
          throw new TypeError(
            "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
          );
        })()
      );
    }
    function M(e, o) {
      (null == o || o > e.length) && (o = e.length);
      for (var t = 0, n = new Array(o); t < o; t++) n[t] = e[t];
      return n;
    }
    u.tokenize = function (e) {
      return e.split(/([{}:;,]|\s+)/);
    };
    var f = Object.prototype.toString,
      h = new o();
    function p(e, o, t, n, r) {
      var i, d;
      for (
        o = o || [], t = t || [], n && (e = n(r, e)), i = 0;
        i < o.length;
        i += 1
      )
        if (o[i] === e) return t[i];
      if ("[object Array]" === f.call(e)) {
        for (
          o.push(e), d = new Array(e.length), t.push(d), i = 0;
          i < e.length;
          i += 1
        )
          d[i] = p(e[i], o, t, n, r);
        return o.pop(), t.pop(), d;
      }
      if (
        (e && e.toJSON && (e = e.toJSON()), "object" === g(e) && null !== e)
      ) {
        o.push(e), (d = {}), t.push(d);
        var m,
          a = [];
        for (m in e) e.hasOwnProperty(m) && a.push(m);
        for (a.sort(), i = 0; i < a.length; i += 1)
          d[(m = a[i])] = p(e[m], o, t, n, m);
        o.pop(), t.pop();
      } else d = e;
      return d;
    }
    (h.useLongestToken = !0),
      (h.tokenize = a.tokenize),
      (h.castInput = function (e) {
        var o = this.options,
          t = o.undefinedReplacement,
          n = o.stringifyReplacer,
          r =
            void 0 === n
              ? function (e, o) {
                  return void 0 === o ? t : o;
                }
              : n;
        return "string" == typeof e
          ? e
          : JSON.stringify(p(e, null, null, r), r, "  ");
      }),
      (h.equals = function (e, t) {
        return o.prototype.equals.call(
          h,
          e.replace(/,([\r\n])/g, "$1"),
          t.replace(/,([\r\n])/g, "$1")
        );
      });
    var b = new o();
    function v(e) {
      var o =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
        t = e.split(/\r\n|[\n\v\f\r\x85]/),
        n = e.match(/\r\n|[\n\v\f\r\x85]/g) || [],
        r = [],
        i = 0;
      function d() {
        var e = {};
        for (r.push(e); i < t.length; ) {
          var n = t[i];
          if (/^(\-\-\-|\+\+\+|@@)\s/.test(n)) break;
          var d = /^(?:Index:|diff(?: -r \w+)+)\s+(.+?)\s*$/.exec(n);
          d && (e.index = d[1]), i++;
        }
        for (m(e), m(e), e.hunks = []; i < t.length; ) {
          var l = t[i];
          if (/^(Index:|diff|\-\-\-|\+\+\+)\s/.test(l)) break;
          if (/^@@/.test(l)) e.hunks.push(a());
          else {
            if (l && o.strict)
              throw new Error(
                "Unknown line " + (i + 1) + " " + JSON.stringify(l)
              );
            i++;
          }
        }
      }
      function m(e) {
        var o = /^(---|\+\+\+)\s+(.*)$/.exec(t[i]);
        if (o) {
          var n = "---" === o[1] ? "old" : "new",
            r = o[2].split("\t", 2),
            d = r[0].replace(/\\\\/g, "\\");
          /^".*"$/.test(d) && (d = d.substr(1, d.length - 2)),
            (e[n + "FileName"] = d),
            (e[n + "Header"] = (r[1] || "").trim()),
            i++;
        }
      }
      function a() {
        var e = i,
          r = t[i++].split(/@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/),
          d = {
            oldStart: +r[1],
            oldLines: void 0 === r[2] ? 1 : +r[2],
            newStart: +r[3],
            newLines: void 0 === r[4] ? 1 : +r[4],
            lines: [],
            linedelimiters: [],
          };
        0 === d.oldLines && (d.oldStart += 1),
          0 === d.newLines && (d.newStart += 1);
        for (
          var m = 0, a = 0;
          i < t.length &&
          !(
            0 === t[i].indexOf("--- ") &&
            i + 2 < t.length &&
            0 === t[i + 1].indexOf("+++ ") &&
            0 === t[i + 2].indexOf("@@")
          );
          i++
        ) {
          var l = 0 == t[i].length && i != t.length - 1 ? " " : t[i][0];
          if ("+" !== l && "-" !== l && " " !== l && "\\" !== l) break;
          d.lines.push(t[i]),
            d.linedelimiters.push(n[i] || "\n"),
            "+" === l ? m++ : "-" === l ? a++ : " " === l && (m++, a++);
        }
        if (
          (m || 1 !== d.newLines || (d.newLines = 0),
          a || 1 !== d.oldLines || (d.oldLines = 0),
          o.strict)
        ) {
          if (m !== d.newLines)
            throw new Error(
              "Added line count did not match for hunk at line " + (e + 1)
            );
          if (a !== d.oldLines)
            throw new Error(
              "Removed line count did not match for hunk at line " + (e + 1)
            );
        }
        return d;
      }
      for (; i < t.length; ) d();
      return r;
    }
    function x(e, o, t) {
      var n = !0,
        r = !1,
        i = !1,
        d = 1;
      return function m() {
        if (n && !i) {
          if ((r ? d++ : (n = !1), e + d <= t)) return d;
          i = !0;
        }
        if (!r) return i || (n = !0), o <= e - d ? -d++ : ((r = !0), m());
      };
    }
    function w(e, o) {
      var t =
        arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
      if (("string" == typeof o && (o = v(o)), Array.isArray(o))) {
        if (o.length > 1)
          throw new Error("applyPatch only works with a single input.");
        o = o[0];
      }
      var n,
        r,
        i = e.split(/\r\n|[\n\v\f\r\x85]/),
        d = e.match(/\r\n|[\n\v\f\r\x85]/g) || [],
        m = o.hunks,
        a =
          t.compareLine ||
          function (e, o, t, n) {
            return o === n;
          },
        l = 0,
        s = t.fuzzFactor || 0,
        u = 0,
        g = 0;
      function c(e, o) {
        for (var t = 0; t < e.lines.length; t++) {
          var n = e.lines[t],
            r = n.length > 0 ? n[0] : " ",
            d = n.length > 0 ? n.substr(1) : n;
          if (" " === r || "-" === r) {
            if (!a(o + 1, i[o], r, d) && ++l > s) return !1;
            o++;
          }
        }
        return !0;
      }
      for (var M = 0; M < m.length; M++) {
        for (
          var f = m[M],
            h = i.length - f.oldLines,
            p = 0,
            b = g + f.oldStart - 1,
            w = x(b, u, h);
          void 0 !== p;
          p = w()
        )
          if (c(f, b + p)) {
            f.offset = g += p;
            break;
          }
        if (void 0 === p) return !1;
        u = f.offset + f.oldStart + f.oldLines;
      }
      for (var T = 0, y = 0; y < m.length; y++) {
        var C = m[y],
          k = C.oldStart + C.offset + T - 1;
        T += C.newLines - C.oldLines;
        for (var q = 0; q < C.lines.length; q++) {
          var L = C.lines[q],
            $ = L.length > 0 ? L[0] : " ",
            N = L.length > 0 ? L.substr(1) : L,
            S = C.linedelimiters[q];
          if (" " === $) k++;
          else if ("-" === $) i.splice(k, 1), d.splice(k, 1);
          else if ("+" === $) i.splice(k, 0, N), d.splice(k, 0, S), k++;
          else if ("\\" === $) {
            var P = C.lines[q - 1] ? C.lines[q - 1][0] : null;
            "+" === P ? (n = !0) : "-" === P && (r = !0);
          }
        }
      }
      if (n) for (; !i[i.length - 1]; ) i.pop(), d.pop();
      else r && (i.push(""), d.push("\n"));
      for (var A = 0; A < i.length - 1; A++) i[A] = i[A] + d[A];
      return i.join("");
    }
    function T(e, o, t, n, r, i, d) {
      d || (d = {}), void 0 === d.context && (d.context = 4);
      var m = l(t, n, d);
      function a(e) {
        return e.map(function (e) {
          return " " + e;
        });
      }
      m.push({ value: "", lines: [] });
      for (
        var s = [],
          u = 0,
          g = 0,
          M = [],
          f = 1,
          h = 1,
          p = function (e) {
            var o = m[e],
              r = o.lines || o.value.replace(/\n$/, "").split("\n");
            if (((o.lines = r), o.added || o.removed)) {
              var i;
              if (!u) {
                var l = m[e - 1];
                (u = f),
                  (g = h),
                  l &&
                    ((M = d.context > 0 ? a(l.lines.slice(-d.context)) : []),
                    (u -= M.length),
                    (g -= M.length));
              }
              (i = M).push.apply(
                i,
                c(
                  r.map(function (e) {
                    return (o.added ? "+" : "-") + e;
                  })
                )
              ),
                o.added ? (h += r.length) : (f += r.length);
            } else {
              if (u)
                if (r.length <= 2 * d.context && e < m.length - 2) {
                  var p;
                  (p = M).push.apply(p, c(a(r)));
                } else {
                  var b,
                    v = Math.min(r.length, d.context);
                  (b = M).push.apply(b, c(a(r.slice(0, v))));
                  var x = {
                    oldStart: u,
                    oldLines: f - u + v,
                    newStart: g,
                    newLines: h - g + v,
                    lines: M,
                  };
                  if (e >= m.length - 2 && r.length <= d.context) {
                    var w = /\n$/.test(t),
                      T = /\n$/.test(n),
                      y = 0 == r.length && M.length > x.oldLines;
                    !w &&
                      y &&
                      t.length > 0 &&
                      M.splice(x.oldLines, 0, "\\ No newline at end of file"),
                      ((w || y) && T) || M.push("\\ No newline at end of file");
                  }
                  s.push(x), (u = 0), (g = 0), (M = []);
                }
              (f += r.length), (h += r.length);
            }
          },
          b = 0;
        b < m.length;
        b++
      )
        p(b);
      return {
        oldFileName: e,
        newFileName: o,
        oldHeader: r,
        newHeader: i,
        hunks: s,
      };
    }
    function y(e, o, t, n, r, i, d) {
      return (function (e) {
        var o = [];
        e.oldFileName == e.newFileName && o.push("Index: " + e.oldFileName),
          o.push(
            "==================================================================="
          ),
          o.push(
            "--- " +
              e.oldFileName +
              (void 0 === e.oldHeader ? "" : "\t" + e.oldHeader)
          ),
          o.push(
            "+++ " +
              e.newFileName +
              (void 0 === e.newHeader ? "" : "\t" + e.newHeader)
          );
        for (var t = 0; t < e.hunks.length; t++) {
          var n = e.hunks[t];
          0 === n.oldLines && (n.oldStart -= 1),
            0 === n.newLines && (n.newStart -= 1),
            o.push(
              "@@ -" +
                n.oldStart +
                "," +
                n.oldLines +
                " +" +
                n.newStart +
                "," +
                n.newLines +
                " @@"
            ),
            o.push.apply(o, n.lines);
        }
        return o.join("\n") + "\n";
      })(T(e, o, t, n, r, i, d));
    }
    function C(e, o) {
      if (o.length > e.length) return !1;
      for (var t = 0; t < o.length; t++) if (o[t] !== e[t]) return !1;
      return !0;
    }
    function k(e) {
      var o = (function e(o) {
          var t = 0;
          var n = 0;
          o.forEach(function (o) {
            if ("string" != typeof o) {
              var r = e(o.mine),
                i = e(o.theirs);
              void 0 !== t &&
                (r.oldLines === i.oldLines ? (t += r.oldLines) : (t = void 0)),
                void 0 !== n &&
                  (r.newLines === i.newLines
                    ? (n += r.newLines)
                    : (n = void 0));
            } else void 0 === n || ("+" !== o[0] && " " !== o[0]) || n++, void 0 === t || ("-" !== o[0] && " " !== o[0]) || t++;
          });
          return { oldLines: t, newLines: n };
        })(e.lines),
        t = o.oldLines,
        n = o.newLines;
      void 0 !== t ? (e.oldLines = t) : delete e.oldLines,
        void 0 !== n ? (e.newLines = n) : delete e.newLines;
    }
    function q(e, o) {
      if ("string" == typeof e) {
        if (/^@@/m.test(e) || /^Index:/m.test(e)) return v(e)[0];
        if (!o)
          throw new Error("Must provide a base reference or pass in a patch");
        return T(void 0, void 0, o, e);
      }
      return e;
    }
    function L(e) {
      return e.newFileName && e.newFileName !== e.oldFileName;
    }
    function $(e, o, t) {
      return o === t ? o : ((e.conflict = !0), { mine: o, theirs: t });
    }
    function N(e, o) {
      return e.oldStart < o.oldStart && e.oldStart + e.oldLines < o.oldStart;
    }
    function S(e, o) {
      return {
        oldStart: e.oldStart,
        oldLines: e.oldLines,
        newStart: e.newStart + o,
        newLines: e.newLines,
        lines: e.lines,
      };
    }
    function P(e, o, t, n, r) {
      var i = { offset: o, lines: t, index: 0 },
        d = { offset: n, lines: r, index: 0 };
      for (
        D(e, i, d), D(e, d, i);
        i.index < i.lines.length && d.index < d.lines.length;

      ) {
        var m = i.lines[i.index],
          a = d.lines[d.index];
        if (("-" !== m[0] && "+" !== m[0]) || ("-" !== a[0] && "+" !== a[0]))
          if ("+" === m[0] && " " === a[0]) {
            var l;
            (l = e.lines).push.apply(l, c(z(i)));
          } else if ("+" === a[0] && " " === m[0]) {
            var s;
            (s = e.lines).push.apply(s, c(z(d)));
          } else
            "-" === m[0] && " " === a[0]
              ? I(e, i, d)
              : "-" === a[0] && " " === m[0]
              ? I(e, d, i, !0)
              : m === a
              ? (e.lines.push(m), i.index++, d.index++)
              : _(e, z(i), z(d));
        else A(e, i, d);
      }
      B(e, i), B(e, d), k(e);
    }
    function A(e, o, t) {
      var n,
        r,
        i = z(o),
        d = z(t);
      if (O(i) && O(d)) {
        var m, a;
        if (C(i, d) && E(t, i, i.length - d.length))
          return void (m = e.lines).push.apply(m, c(i));
        if (C(d, i) && E(o, d, d.length - i.length))
          return void (a = e.lines).push.apply(a, c(d));
      } else if (((r = d), (n = i).length === r.length && C(n, r))) {
        var l;
        return void (l = e.lines).push.apply(l, c(i));
      }
      _(e, i, d);
    }
    function I(e, o, t, n) {
      var r,
        i = z(o),
        d = (function (e, o) {
          var t = [],
            n = [],
            r = 0,
            i = !1,
            d = !1;
          for (; r < o.length && e.index < e.lines.length; ) {
            var m = e.lines[e.index],
              a = o[r];
            if ("+" === a[0]) break;
            if (((i = i || " " !== m[0]), n.push(a), r++, "+" === m[0]))
              for (d = !0; "+" === m[0]; ) t.push(m), (m = e.lines[++e.index]);
            a.substr(1) === m.substr(1) ? (t.push(m), e.index++) : (d = !0);
          }
          "+" === (o[r] || "")[0] && i && (d = !0);
          if (d) return t;
          for (; r < o.length; ) n.push(o[r++]);
          return { merged: n, changes: t };
        })(t, i);
      d.merged
        ? (r = e.lines).push.apply(r, c(d.merged))
        : _(e, n ? d : i, n ? i : d);
    }
    function _(e, o, t) {
      (e.conflict = !0), e.lines.push({ conflict: !0, mine: o, theirs: t });
    }
    function D(e, o, t) {
      for (; o.offset < t.offset && o.index < o.lines.length; ) {
        var n = o.lines[o.index++];
        e.lines.push(n), o.offset++;
      }
    }
    function B(e, o) {
      for (; o.index < o.lines.length; ) {
        var t = o.lines[o.index++];
        e.lines.push(t);
      }
    }
    function z(e) {
      for (var o = [], t = e.lines[e.index][0]; e.index < e.lines.length; ) {
        var n = e.lines[e.index];
        if (("-" === t && "+" === n[0] && (t = "+"), t !== n[0])) break;
        o.push(n), e.index++;
      }
      return o;
    }
    function O(e) {
      return e.reduce(function (e, o) {
        return e && "-" === o[0];
      }, !0);
    }
    function E(e, o, t) {
      for (var n = 0; n < t; n++) {
        var r = o[o.length - t + n].substr(1);
        if (e.lines[e.index + n] !== " " + r) return !1;
      }
      return (e.index += t), !0;
    }
    (b.tokenize = function (e) {
      return e.slice();
    }),
      (b.join = b.removeEmpty = function (e) {
        return e;
      }),
      (e.Diff = o),
      (e.applyPatch = w),
      (e.applyPatches = function (e, o) {
        "string" == typeof e && (e = v(e));
        var t = 0;
        !(function n() {
          var r = e[t++];
          if (!r) return o.complete();
          o.loadFile(r, function (e, t) {
            if (e) return o.complete(e);
            var i = w(t, r, o);
            o.patched(r, i, function (e) {
              if (e) return o.complete(e);
              n();
            });
          });
        })();
      }),
      (e.canonicalize = p),
      (e.convertChangesToDMP = function (e) {
        for (var o, t, n = [], r = 0; r < e.length; r++)
          (t = (o = e[r]).added ? 1 : o.removed ? -1 : 0), n.push([t, o.value]);
        return n;
      }),
      (e.convertChangesToXML = function (e) {
        for (var o = [], t = 0; t < e.length; t++) {
          var n = e[t];
          n.added ? o.push("<ins>") : n.removed && o.push("<del>"),
            o.push(
              ((r = n.value),
              void 0,
              r
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;"))
            ),
            n.added ? o.push("</ins>") : n.removed && o.push("</del>");
        }
        var r;
        return o.join("");
      }),
      (e.createPatch = function (e, o, t, n, r, i) {
        return y(e, e, o, t, n, r, i);
      }),
      (e.createTwoFilesPatch = y),
      (e.diffArrays = function (e, o, t) {
        return b.diff(e, o, t);
      }),
      (e.diffChars = function (e, o, t) {
        return n.diff(e, o, t);
      }),
      (e.diffCss = function (e, o, t) {
        return u.diff(e, o, t);
      }),
      (e.diffJson = function (e, o, t) {
        return h.diff(e, o, t);
      }),
      (e.diffLines = l),
      (e.diffSentences = function (e, o, t) {
        return s.diff(e, o, t);
      }),
      (e.diffTrimmedLines = function (e, o, t) {
        var n = r(t, { ignoreWhitespace: !0 });
        return a.diff(e, o, n);
      }),
      (e.diffWords = function (e, o, t) {
        return (t = r(t, { ignoreWhitespace: !0 })), m.diff(e, o, t);
      }),
      (e.diffWordsWithSpace = function (e, o, t) {
        return m.diff(e, o, t);
      }),
      (e.merge = function (e, o, t) {
        (e = q(e, t)), (o = q(o, t));
        var n = {};
        (e.index || o.index) && (n.index = e.index || o.index),
          (e.newFileName || o.newFileName) &&
            (L(e)
              ? L(o)
                ? ((n.oldFileName = $(n, e.oldFileName, o.oldFileName)),
                  (n.newFileName = $(n, e.newFileName, o.newFileName)),
                  (n.oldHeader = $(n, e.oldHeader, o.oldHeader)),
                  (n.newHeader = $(n, e.newHeader, o.newHeader)))
                : ((n.oldFileName = e.oldFileName),
                  (n.newFileName = e.newFileName),
                  (n.oldHeader = e.oldHeader),
                  (n.newHeader = e.newHeader))
              : ((n.oldFileName = o.oldFileName || e.oldFileName),
                (n.newFileName = o.newFileName || e.newFileName),
                (n.oldHeader = o.oldHeader || e.oldHeader),
                (n.newHeader = o.newHeader || e.newHeader))),
          (n.hunks = []);
        for (
          var r = 0, i = 0, d = 0, m = 0;
          r < e.hunks.length || i < o.hunks.length;

        ) {
          var a = e.hunks[r] || { oldStart: 1 / 0 },
            l = o.hunks[i] || { oldStart: 1 / 0 };
          if (N(a, l))
            n.hunks.push(S(a, d)), r++, (m += a.newLines - a.oldLines);
          else if (N(l, a))
            n.hunks.push(S(l, m)), i++, (d += l.newLines - l.oldLines);
          else {
            var s = {
              oldStart: Math.min(a.oldStart, l.oldStart),
              oldLines: 0,
              newStart: Math.min(a.newStart + d, l.oldStart + m),
              newLines: 0,
              lines: [],
            };
            P(s, a.oldStart, a.lines, l.oldStart, l.lines),
              i++,
              r++,
              n.hunks.push(s);
          }
        }
        return n;
      }),
      (e.parsePatch = v),
      (e.structuredPatch = T),
      Object.defineProperty(e, "__esModule", { value: !0 });
  });
var __awaiter =
  (this && this.__awaiter) ||
  function (e, o, t, n) {
    return new (t || (t = Promise))(function (r, i) {
      function d(e) {
        try {
          a(n.next(e));
        } catch (e) {
          i(e);
        }
      }
      function m(e) {
        try {
          a(n.throw(e));
        } catch (e) {
          i(e);
        }
      }
      function a(e) {
        var o;
        e.done
          ? r(e.value)
          : ((o = e.value),
            o instanceof t
              ? o
              : new t(function (e) {
                  e(o);
                })).then(d, m);
      }
      a((n = n.apply(e, o || [])).next());
    });
  };
function docReady(e) {
  let o = function () {
    window.$ ? e() : setTimeout(o, 250);
  };
  "complete" === document.readyState || "interactive" === document.readyState
    ? setTimeout(o, 1)
    : document.addEventListener("DOMContentLoaded", o);
}
define("lib/common", ["require", "exports", "monaco-editor"], function (
  e,
  o,
  t
) {
  "use strict";
  Object.defineProperty(o, "__esModule", { value: !0 }),
    (o.insertText = o.options = void 0),
    (o.options = {
      suggestionsLimit: 1e4,
      maxParsedLineLength: 1e4,
      locale: "en",
    }),
    (o.insertText = function (e, o, n, r, i) {
      null != r || (r = o),
        e.executeEdits(
          null,
          [
            {
              range: {
                startLineNumber: o.lineNumber,
                endLineNumber: o.lineNumber,
                startColumn: o.column,
                endColumn: o.column + (null != i ? i : 0),
              },
              text: n,
            },
          ],
          [new t.Selection(r.lineNumber, r.column, r.lineNumber, r.column)]
        );
    });
}),
  define("lib/data", ["require", "exports", "lib/common"], function (e, o, t) {
    "use strict";
    Object.defineProperty(o, "__esModule", { value: !0 }),
      (o.imports = o.getString = o.strings = o.snippetDictionary = o.environmentDictionary = o.commandDictionary = o.mathEnvironments = o.envStarCommands = o.envCommands = void 0),
      (o.envCommands = [
        "\\begin",
        "\\end",
        "\\envdef",
        "\\newenvironment",
        "\\newtheorem",
        "\\renewenvironment",
      ]),
      (o.envStarCommands = [
        "\\newenvironment*",
        "\\renewenvironment*",
        "\\newtheorem*",
      ]),
      (o.mathEnvironments = [
        "align",
        "align*",
        "alignat",
        "alignat*",
        "equation",
        "equation*",
        "gather",
        "gather*",
        "multline",
        "multline*",
      ]),
      (o.commandDictionary = {
        "\\AA": { mode: "T" },
        "\\addtocounter": {
          mode: "MT",
          signature: "\\addtocounter{计数器}{值}",
        },
        "\\adef": { mode: "MT", signature: "\\adef<命令><参数>{定义}" },
        "\\AE": { mode: "T" },
        "\\ae": { mode: "T" },
        "\\alet": { mode: "MT", signature: "\\alet<命令><命令>" },
        "\\Alph": { mode: "MT", signature: "\\Alph{计数器}" },
        "\\alph": { mode: "MT", signature: "\\alph{计数器}" },
        "\\arabic": { mode: "MT", signature: "\\arabic{计数器}" },
        "\\backslash": { mode: "MT" },
        "\\begin": {
          mode: "MT",
          insertText: "\\begin{",
          signature: "\\begin{环境}",
        },
        "\\begingroup": { mode: "MT" },
        "\\bf": { mode: "T" },
        "\\bibitem": { mode: "T", signature: "\\bibitem[编号]{标签}" },
        "\\bullet": { mode: "MT" },
        "\\c": { mode: "T", signature: "\\c{}" },
        "\\cite": { mode: "T", signature: "\\cite[内容]{标签}" },
        "\\code": { mode: "T", signature: "\\code{代码}" },
        "\\codeblock": { mode: "T", signature: "\\codeblock{代码}" },
        "\\color": { mode: "T", signature: "\\color{颜色代码}" },
        "\\colour": { mode: "T", signature: "\\colour{颜色代码}" },
        "\\corollaryname": { mode: "MT" },
        "\\dagger": { mode: "MT" },
        "\\ddagger": { mode: "MT" },
        "\\def": { mode: "MT", signature: "\\def<命令><参数>{定义}" },
        "\\definitionname": { mode: "MT" },
        "\\edef": { mode: "MT", signature: "\\edef<命令><参数>{定义}" },
        "\\em": { mode: "T" },
        "\\emph": { mode: "T", signature: "\\emph{文字}" },
        "\\end": { mode: "MT", signature: "\\end{环境}" },
        "\\endgroup": { mode: "MT" },
        "\\english": { mode: "MT", signature: "\\english[]" },
        "\\envadef": {
          mode: "MT",
          signature: "\\envadef{环境}{参数}{开始}{结束}",
        },
        "\\envdef": {
          mode: "MT",
          signature: "\\envdef{环境}{参数}{开始}{结束}",
        },
        "\\envpdef": {
          mode: "MT",
          signature: "\\envpdef{环境}{参数}{开始}{结束}",
        },
        "\\eqno": { mode: "M" },
        "\\eqref": { mode: "T", signature: "\\eqref{}" },
        "\\floatright": { mode: "T", signature: "\\floatright{内容}" },
        "\\gdef": { mode: "MT", signature: "\\gdef<命令><参数>{定义}" },
        "\\glet": { mode: "MT", signature: "\\glet<命令><命令>" },
        "\\H": { mode: "T", signature: "\\H{}" },
        "\\href": { mode: "T", signature: "\\href{链接}{文字}" },
        "\\i": { mode: "MT" },
        "\\it": { mode: "T" },
        "\\item": { mode: "T", signature: "\\item[编号]" },
        "\\j": { mode: "MT" },
        "\\l": { mode: "T" },
        "\\L": { mode: "T" },
        "\\label": { mode: "T", signature: "\\label{标签}" },
        "\\lang": { mode: "T", signature: "\\lang{语言代码}{文字}" },
        "\\lemmaname": { mode: "T" },
        "\\leqno": { mode: "M" },
        "\\let": { mode: "MT", signature: "\\let<命令><命令>" },
        "\\md": { mode: "T" },
        "\\newcommand": {
          mode: "MT",
          signature: "\\newcommand<命令>[参数]{定义}",
        },
        "\\newcounter": { mode: "MT", signature: "\\newcounter[计数器]" },
        "\\newenvironment": {
          mode: "MT",
          signature: "\\newenvironment{环境}[参数]{开始}{结束}",
        },
        "\\newtheorem": { mode: "MT", signature: "\\newtheorem{环境}{名称}" },
        "\\notoc": { mode: "T" },
        "\\nosectionnumbers": { mode: "T" },
        "\\numbersections": { mode: "T" },
        "\\numbersubsections": { mode: "T" },
        "\\numbersubsubsections": { mode: "T" },
        "\\numberwithin": {
          mode: "MT",
          signature: "\\numberwithin{子计数器}{父计数器}",
        },
        "\\o": { mode: "T" },
        "\\O": { mode: "T" },
        "\\oe": { mode: "T" },
        "\\OE": { mode: "T" },
        "\\operatornamewithlimits": {
          mode: "M",
          signature: "\\operatornamewithlimits{文字}",
        },
        "\\par": { mode: "T" },
        "\\pdef": { mode: "MT", signature: "\\pdef<命令><参数>{定义}" },
        "\\plet": { mode: "MT", signature: "\\plet<命令><命令>" },
        "\\proofname": { mode: "T" },
        "\\propositionname": { mode: "T" },
        "\\qed": { mode: "T" },
        "\\qedhere": { mode: "MT" },
        "\\qedsymbol": { mode: "T" },
        "\\qquad": { mode: "T" },
        "\\quad": { mode: "T" },
        "\\r": { mode: "T", signature: "\\r{}" },
        "\\ref": { mode: "MT", signature: "\\ref{标签}" },
        "\\refname": { mode: "T" },
        "\\refstepcounter": {
          mode: "MT",
          signature: "\\refstepcounter{计数器}",
        },
        "\\remarkname": { mode: "T" },
        "\\renewcommand": {
          mode: "MT",
          signature: "\\renewcommand<命令>[参数]{定义}",
        },
        "\\renewenvironment": {
          mode: "MT",
          signature: "\\renewenvironment{环境}[参数]{开始}{结束}",
        },
        "\\reqno": { mode: "M" },
        "\\rm": { mode: "T" },
        "\\Roman": { mode: "MT", signature: "\\Roman{计数器}" },
        "\\roman": { mode: "MT", signature: "\\roman{计数器}" },
        "\\S": { mode: "T" },
        "\\section": { mode: "T", signature: "\\section{标题}" },
        "\\setcounter": { mode: "MT", signature: "\\setcounter{计数器}" },
        "\\setdisplaytitle": {
          mode: "T",
          signature: "\\setdisplaytitle{文字}",
        },
        "\\sethtmltitle": { mode: "T", signature: "\\sethtmltitle{文字}" },
        "\\setlanguage": { mode: "T", signature: "\\setlanguage{语言代码}" },
        "\\size": { mode: "T", signature: "\\size{大小}" },
        "\\ss": { mode: "T" },
        "\\SS": { mode: "T" },
        "\\stepcounter": { mode: "T", signature: "\\stepcounter{计数器}" },
        "\\subpage": { mode: "T", signature: "\\subpage[编号]{页标题}[文字]" },
        "\\subsection": { mode: "T", signature: "\\subsection{标题}" },
        "\\subsubpage": {
          mode: "T",
          signature: "\\subsubpage[编号]{页标题}[文字]",
        },
        "\\subsubsection": { mode: "T", signature: "\\subsubsection{标题}" },
        "\\subsubsubpage": {
          mode: "T",
          signature: "\\subsubsubpage[编号]{页标题}[文字]",
        },
        "\\tdef": { mode: "MT", signature: "\\tdef<命令><参数>{定义}" },
        "\\textbf": { mode: "MT", signature: "\\textbf{文字}" },
        "\\textcolor": { mode: "T", signature: "\\textcolor{颜色}{文字}" },
        "\\textcolour": { mode: "T", signature: "\\textcolour{颜色}{文字}" },
        "\\textit": { mode: "MT", signature: "\\textit{文字}" },
        "\\textmd": { mode: "MT", signature: "\\textmd{文字}" },
        "\\textrm": { mode: "MT", signature: "\\textrm{文字}" },
        "\\textsize": { mode: "T", signature: "\\textsize{大小}{文字}" },
        "\\thmprefix": { mode: "T" },
        "\\tikz": { mode: "T", signature: "\\tikz{代码}" },
        "\\tlet": { mode: "MT", signature: "\\tlet<命令><命令>" },
        "\\tocname": { mode: "T" },
        "\\u": { mode: "T", signature: "\\u{}" },
        "\\url": { mode: "T", signature: "\\url{链接}" },
        "\\v": { mode: "T", signature: "\\v{}" },
        "\\xeqno": { mode: "M" },
        "\\above": { mode: "M" },
        "\\acute": { mode: "M" },
        "\\alef": { mode: "M" },
        "\\alefsym": { mode: "M" },
        "\\aleph": { mode: "M" },
        "\\allowbreak": { mode: "M" },
        "\\Alpha": { mode: "M" },
        "\\alpha": { mode: "M" },
        "\\amalg": { mode: "M" },
        "\\And": { mode: "M" },
        "\\angle": { mode: "M" },
        "\\approx": { mode: "M" },
        "\\approxeq": { mode: "M" },
        "\\arccos": { mode: "M" },
        "\\arcctg": { mode: "M" },
        "\\arcsin": { mode: "M" },
        "\\arctan": { mode: "M" },
        "\\arctg": { mode: "M" },
        "\\arg": { mode: "M" },
        "\\argmax": { mode: "M" },
        "\\argmin": { mode: "M" },
        "\\ast": { mode: "M" },
        "\\asymp": { mode: "M" },
        "\\atop": { mode: "M" },
        "\\backepsilon": { mode: "M" },
        "\\backprime": { mode: "M" },
        "\\backsim": { mode: "M" },
        "\\backsimeq": { mode: "M" },
        "\\bar": { mode: "M" },
        "\\barwedge": { mode: "M" },
        "\\Bbb": { mode: "M" },
        "\\Bbbk": { mode: "M" },
        "\\bcancel": { mode: "M" },
        "\\because": { mode: "M" },
        "\\Beta": { mode: "M" },
        "\\beta": { mode: "M" },
        "\\beth": { mode: "M" },
        "\\between": { mode: "M" },
        "\\big": { mode: "M" },
        "\\Big": { mode: "M" },
        "\\bigcap": { mode: "M" },
        "\\bigcirc": { mode: "M" },
        "\\bigcup": { mode: "M" },
        "\\bigg": { mode: "M" },
        "\\Bigg": { mode: "M" },
        "\\biggl": { mode: "M" },
        "\\Biggl": { mode: "M" },
        "\\biggm": { mode: "M" },
        "\\Biggm": { mode: "M" },
        "\\biggr": { mode: "M" },
        "\\Biggr": { mode: "M" },
        "\\bigl": { mode: "M" },
        "\\Bigl": { mode: "M" },
        "\\bigm": { mode: "M" },
        "\\Bigm": { mode: "M" },
        "\\bigodot": { mode: "M" },
        "\\bigoplus": { mode: "M" },
        "\\bigotimes": { mode: "M" },
        "\\bigr": { mode: "M" },
        "\\Bigr": { mode: "M" },
        "\\bigsqcup": { mode: "M" },
        "\\bigstar": { mode: "M" },
        "\\bigtriangledown": { mode: "M" },
        "\\bigtriangleup": { mode: "M" },
        "\\biguplus": { mode: "M" },
        "\\bigvee": { mode: "M" },
        "\\bigwedge": { mode: "M" },
        "\\binom": { mode: "M" },
        "\\blacklozenge": { mode: "M" },
        "\\blacksquare": { mode: "M" },
        "\\blacktriangle": { mode: "M" },
        "\\blacktriangledown": { mode: "M" },
        "\\blacktriangleleft": { mode: "M" },
        "\\blacktriangleright": { mode: "M" },
        "\\bm": { mode: "M" },
        "\\bmod": { mode: "M" },
        "\\bold": { mode: "M" },
        "\\boldsymbol": { mode: "M" },
        "\\bot": { mode: "M" },
        "\\bowtie": { mode: "M" },
        "\\Box": { mode: "M" },
        "\\boxdot": { mode: "M" },
        "\\boxed": { mode: "M" },
        "\\boxminus": { mode: "M" },
        "\\boxplus": { mode: "M" },
        "\\boxtimes": { mode: "M" },
        "\\Bra": { mode: "M" },
        "\\bra": { mode: "M" },
        "\\braket": { mode: "M" },
        "\\brace": { mode: "M" },
        "\\brack": { mode: "M" },
        "\\breve": { mode: "M" },
        "\\bull": { mode: "M" },
        "\\Bumpeq": { mode: "M" },
        "\\bumpeq": { mode: "M" },
        "\\cal": { mode: "M" },
        "\\cancel": { mode: "M" },
        "\\Cap": { mode: "M" },
        "\\cap": { mode: "M" },
        "\\cdot": { mode: "M" },
        "\\cdotp": { mode: "M" },
        "\\cdots": { mode: "M" },
        "\\centerdot": { mode: "M" },
        "\\cfrac": { mode: "M" },
        "\\check": { mode: "M" },
        "\\ch": { mode: "M" },
        "\\checkmark": { mode: "M" },
        "\\Chi": { mode: "M" },
        "\\chi": { mode: "M" },
        "\\choose": { mode: "M" },
        "\\circ": { mode: "M" },
        "\\circeq": { mode: "M" },
        "\\circlearrowleft": { mode: "M" },
        "\\circlearrowright": { mode: "M" },
        "\\circledast": { mode: "M" },
        "\\circledcirc": { mode: "M" },
        "\\circleddash": { mode: "M" },
        "\\circledR": { mode: "M" },
        "\\circledS": { mode: "M" },
        "\\clubs": { mode: "M" },
        "\\clubsuit": { mode: "M" },
        "\\cnums": { mode: "M" },
        "\\colon": { mode: "M" },
        "\\Colonapprox": { mode: "M" },
        "\\colonapprox": { mode: "M" },
        "\\Coloneq": { mode: "M" },
        "\\coloneq": { mode: "M" },
        "\\Coloneqq": { mode: "M" },
        "\\coloneqq": { mode: "M" },
        "\\Colonsim": { mode: "M" },
        "\\colonsim": { mode: "M" },
        "\\colorbox": { mode: "M" },
        "\\complement": { mode: "M" },
        "\\Complex": { mode: "M" },
        "\\cong": { mode: "M" },
        "\\coprod": { mode: "M" },
        "\\copyright": { mode: "M" },
        "\\cos": { mode: "M" },
        "\\cosec": { mode: "M" },
        "\\cosh": { mode: "M" },
        "\\cot": { mode: "M" },
        "\\cotg": { mode: "M" },
        "\\coth": { mode: "M" },
        "\\cr": { mode: "M" },
        "\\csc": { mode: "M" },
        "\\ctg": { mode: "M" },
        "\\cth": { mode: "M" },
        "\\Cup": { mode: "M" },
        "\\cup": { mode: "M" },
        "\\curlyeqprec": { mode: "M" },
        "\\curlyeqsucc": { mode: "M" },
        "\\curlyvee": { mode: "M" },
        "\\curlywedge": { mode: "M" },
        "\\curvearrowleft": { mode: "M" },
        "\\curvearrowright": { mode: "M" },
        "\\dag": { mode: "M" },
        "\\Dagger": { mode: "M" },
        "\\daleth": { mode: "M" },
        "\\Darr": { mode: "M" },
        "\\dArr": { mode: "M" },
        "\\darr": { mode: "M" },
        "\\dashleftarrow": { mode: "M" },
        "\\dashrightarrow": { mode: "M" },
        "\\dashv": { mode: "M" },
        "\\dbinom": { mode: "M" },
        "\\dblcolon": { mode: "M" },
        "\\ddag": { mode: "M" },
        "\\ddot": { mode: "M" },
        "\\ddots": { mode: "M" },
        "\\deg": { mode: "M" },
        "\\degree": { mode: "M" },
        "\\delta": { mode: "M" },
        "\\Delta": { mode: "M" },
        "\\det": { mode: "M" },
        "\\digamma": { mode: "M" },
        "\\dfrac": { mode: "M" },
        "\\diagdown": { mode: "M" },
        "\\diagup": { mode: "M" },
        "\\Diamond": { mode: "M" },
        "\\diamond": { mode: "M" },
        "\\diamonds": { mode: "M" },
        "\\diamondsuit": { mode: "M" },
        "\\dim": { mode: "M" },
        "\\displaystyle": { mode: "M" },
        "\\div": { mode: "M" },
        "\\divideontimes": { mode: "M" },
        "\\dot": { mode: "M" },
        "\\Doteq": { mode: "M" },
        "\\doteq": { mode: "M" },
        "\\doteqdot": { mode: "M" },
        "\\dotplus": { mode: "M" },
        "\\dots": { mode: "M" },
        "\\dotsb": { mode: "M" },
        "\\dotsc": { mode: "M" },
        "\\dotsi": { mode: "M" },
        "\\dotsm": { mode: "M" },
        "\\dotso": { mode: "M" },
        "\\doublebarwedge": { mode: "M" },
        "\\doublecap": { mode: "M" },
        "\\doublecup": { mode: "M" },
        "\\Downarrow": { mode: "M" },
        "\\downarrow": { mode: "M" },
        "\\downdownarrows": { mode: "M" },
        "\\downharpoonleft": { mode: "M" },
        "\\downharpoonright": { mode: "M" },
        "\\ell": { mode: "M" },
        "\\empty": { mode: "M" },
        "\\emptyset": { mode: "M" },
        "\\enspace": { mode: "M" },
        "\\Epsilon": { mode: "M" },
        "\\epsilon": { mode: "M" },
        "\\eqcirc": { mode: "M" },
        "\\Eqcolon": { mode: "M" },
        "\\eqcolon": { mode: "M" },
        "\\Eqqcolon": { mode: "M" },
        "\\eqqcolon": { mode: "M" },
        "\\eqsim": { mode: "M" },
        "\\eqslantgtr": { mode: "M" },
        "\\eqslantless": { mode: "M" },
        "\\equiv": { mode: "M" },
        "\\Eta": { mode: "M" },
        "\\eta": { mode: "M" },
        "\\eth": { mode: "M" },
        "\\exist": { mode: "M" },
        "\\exists": { mode: "M" },
        "\\exp": { mode: "M" },
        "\\expandafter": { mode: "M" },
        "\\fallingdotseq": { mode: "M" },
        "\\fbox": { mode: "M" },
        "\\fcolorbox": { mode: "M" },
        "\\Finv": { mode: "M" },
        "\\flat": { mode: "M" },
        "\\footnotesize": { mode: "M" },
        "\\forall": { mode: "M" },
        "\\frac": { mode: "M" },
        "\\frak": { mode: "M" },
        "\\frown": { mode: "M" },
        "\\futurelet": { mode: "M" },
        "\\Game": { mode: "M" },
        "\\Gamma": { mode: "M" },
        "\\gamma": { mode: "M" },
        "\\gcd": { mode: "M" },
        "\\ge": { mode: "M" },
        "\\genfrac": { mode: "M" },
        "\\geq": { mode: "M" },
        "\\geqq": { mode: "M" },
        "\\geqslant": { mode: "M" },
        "\\gets": { mode: "M" },
        "\\gg": { mode: "M" },
        "\\ggg": { mode: "M" },
        "\\gggtr": { mode: "M" },
        "\\gimel": { mode: "M" },
        "\\global": { mode: "M" },
        "\\gnapprox": { mode: "M" },
        "\\gneq": { mode: "M" },
        "\\gneqq": { mode: "M" },
        "\\gnsim": { mode: "M" },
        "\\grave": { mode: "M" },
        "\\gt": { mode: "M" },
        "\\gtrdot": { mode: "M" },
        "\\gtrapprox": { mode: "M" },
        "\\gtreqless": { mode: "M" },
        "\\gtreqqless": { mode: "M" },
        "\\gtrless": { mode: "M" },
        "\\gtrsim": { mode: "M" },
        "\\gvertneqq": { mode: "M" },
        "\\Harr": { mode: "M" },
        "\\hArr": { mode: "M" },
        "\\harr": { mode: "M" },
        "\\hat": { mode: "M" },
        "\\hbar": { mode: "M" },
        "\\hdashline": { mode: "M" },
        "\\hearts": { mode: "M" },
        "\\heartsuit": { mode: "M" },
        "\\hline": { mode: "M" },
        "\\hom": { mode: "M" },
        "\\hookleftarrow": { mode: "M" },
        "\\hookrightarrow": { mode: "M" },
        "\\hphantom": { mode: "M" },
        "\\hskip": { mode: "M" },
        "\\hslash": { mode: "M" },
        "\\hspace": { mode: "M" },
        "\\htmlClass": { mode: "M" },
        "\\htmlData": { mode: "M" },
        "\\htmlId": { mode: "M" },
        "\\htmlStyle": { mode: "M" },
        "\\huge": { mode: "M" },
        "\\Huge": { mode: "M" },
        "\\iff": { mode: "M" },
        "\\iiint": { mode: "M" },
        "\\iint": { mode: "M" },
        "\\Im": { mode: "M" },
        "\\image": { mode: "M" },
        "\\imath": { mode: "M" },
        "\\impliedby": { mode: "M" },
        "\\implies": { mode: "M" },
        "\\in": { mode: "M" },
        "\\inf": { mode: "M" },
        "\\infin": { mode: "M" },
        "\\infty": { mode: "M" },
        "\\int": { mode: "M" },
        "\\intercal": { mode: "M" },
        "\\intop": { mode: "M" },
        "\\Iota": { mode: "M" },
        "\\iota": { mode: "M" },
        "\\isin": { mode: "M" },
        "\\jmath": { mode: "M" },
        "\\Join": { mode: "M" },
        "\\Kappa": { mode: "M" },
        "\\kappa": { mode: "M" },
        "\\KaTeX": { mode: "M" },
        "\\ker": { mode: "M" },
        "\\kern": { mode: "M" },
        "\\Ket": { mode: "M" },
        "\\ket": { mode: "M" },
        "\\Lambda": { mode: "M" },
        "\\lambda": { mode: "M" },
        "\\land": { mode: "M" },
        "\\langle": { mode: "M" },
        "\\Larr": { mode: "M" },
        "\\lArr": { mode: "M" },
        "\\larr": { mode: "M" },
        "\\large": { mode: "M" },
        "\\Large": { mode: "M" },
        "\\LARGE": { mode: "M" },
        "\\LaTeX": { mode: "M" },
        "\\lBrace": { mode: "M" },
        "\\lbrace": { mode: "M" },
        "\\lbrack": { mode: "M" },
        "\\lceil": { mode: "M" },
        "\\ldotp": { mode: "M" },
        "\\ldots": { mode: "M" },
        "\\le": { mode: "M" },
        "\\leadsto": { mode: "M" },
        "\\left": { mode: "M" },
        "\\leftarrow": { mode: "M" },
        "\\Leftarrow": { mode: "M" },
        "\\leftharpoondown": { mode: "M" },
        "\\leftharpoonup": { mode: "M" },
        "\\leftleftarrows": { mode: "M" },
        "\\Leftrightarrow": { mode: "M" },
        "\\leftrightarrow": { mode: "M" },
        "\\leftrightarrows": { mode: "M" },
        "\\leftrightharpoons": { mode: "M" },
        "\\leftrightsquigarrow": { mode: "M" },
        "\\leftthreetimes": { mode: "M" },
        "\\leq": { mode: "M" },
        "\\leqq": { mode: "M" },
        "\\leqslant": { mode: "M" },
        "\\lessapprox": { mode: "M" },
        "\\lessdot": { mode: "M" },
        "\\lesseqgtr": { mode: "M" },
        "\\lesseqqgtr": { mode: "M" },
        "\\lessgtr": { mode: "M" },
        "\\lesssim": { mode: "M" },
        "\\lfloor": { mode: "M" },
        "\\lg": { mode: "M" },
        "\\lgroup": { mode: "M" },
        "\\lhd": { mode: "M" },
        "\\lim": { mode: "M" },
        "\\liminf": { mode: "M" },
        "\\limits": { mode: "M" },
        "\\limsup": { mode: "M" },
        "\\ll": { mode: "M" },
        "\\llap": { mode: "M" },
        "\\llbracket": { mode: "M" },
        "\\llcorner": { mode: "M" },
        "\\Lleftarrow": { mode: "M" },
        "\\lll": { mode: "M" },
        "\\llless": { mode: "M" },
        "\\lmoustache": { mode: "M" },
        "\\ln": { mode: "M" },
        "\\lnapprox": { mode: "M" },
        "\\lneq": { mode: "M" },
        "\\lneqq": { mode: "M" },
        "\\lnot": { mode: "M" },
        "\\lnsim": { mode: "M" },
        "\\log": { mode: "M" },
        "\\long": { mode: "M" },
        "\\Longleftarrow": { mode: "M" },
        "\\longleftarrow": { mode: "M" },
        "\\Longleftrightarrow": { mode: "M" },
        "\\longleftrightarrow": { mode: "M" },
        "\\longmapsto": { mode: "M" },
        "\\Longrightarrow": { mode: "M" },
        "\\longrightarrow": { mode: "M" },
        "\\looparrowleft": { mode: "M" },
        "\\looparrowright": { mode: "M" },
        "\\lor": { mode: "M" },
        "\\lozenge": { mode: "M" },
        "\\lparen": { mode: "M" },
        "\\Lrarr": { mode: "M" },
        "\\lrArr": { mode: "M" },
        "\\lrarr": { mode: "M" },
        "\\lrcorner": { mode: "M" },
        "\\lq": { mode: "M" },
        "\\Lsh": { mode: "M" },
        "\\lt": { mode: "M" },
        "\\ltimes": { mode: "M" },
        "\\lVert": { mode: "M" },
        "\\lvert": { mode: "M" },
        "\\lvertneqq": { mode: "M" },
        "\\maltese": { mode: "M" },
        "\\mapsto": { mode: "M" },
        "\\mathbb": { mode: "M" },
        "\\mathbf": { mode: "M" },
        "\\mathbin": { mode: "M" },
        "\\mathcal": { mode: "M" },
        "\\mathchoice": { mode: "M" },
        "\\mathclap": { mode: "M" },
        "\\mathclose": { mode: "M" },
        "\\mathellipsis": { mode: "M" },
        "\\mathfrak": { mode: "M" },
        "\\mathinner": { mode: "M" },
        "\\mathit": { mode: "M" },
        "\\mathllap": { mode: "M" },
        "\\mathnormal": { mode: "M" },
        "\\mathop": { mode: "M" },
        "\\mathopen": { mode: "M" },
        "\\mathord": { mode: "M" },
        "\\mathpunct": { mode: "M" },
        "\\mathrel": { mode: "M" },
        "\\mathrlap": { mode: "M" },
        "\\mathring": { mode: "M" },
        "\\mathrm": { mode: "M" },
        "\\mathscr": { mode: "M" },
        "\\mathsf": { mode: "M" },
        "\\mathsterling": { mode: "M" },
        "\\mathtt": { mode: "M" },
        "\\max": { mode: "M" },
        "\\measuredangle": { mode: "M" },
        "\\medspace": { mode: "M" },
        "\\mho": { mode: "M" },
        "\\mid": { mode: "M" },
        "\\middle": { mode: "M" },
        "\\min": { mode: "M" },
        "\\minuso": { mode: "M" },
        "\\mkern": { mode: "M" },
        "\\mod": { mode: "M" },
        "\\models": { mode: "M" },
        "\\mp": { mode: "M" },
        "\\mskip": { mode: "M" },
        "\\Mu": { mode: "M" },
        "\\mu": { mode: "M" },
        "\\multimap": { mode: "M" },
        "\\N": { mode: "M" },
        "\\nabla": { mode: "M" },
        "\\natnums": { mode: "M" },
        "\\natural": { mode: "M" },
        "\\negmedspace": { mode: "M" },
        "\\ncong": { mode: "M" },
        "\\ne": { mode: "M" },
        "\\nearrow": { mode: "M" },
        "\\neg": { mode: "M" },
        "\\negthickspace": { mode: "M" },
        "\\negthinspace": { mode: "M" },
        "\\neq": { mode: "M" },
        "\\newline": { mode: "M" },
        "\\nexists": { mode: "M" },
        "\\ngeq": { mode: "M" },
        "\\ngeqq": { mode: "M" },
        "\\ngeqslant": { mode: "M" },
        "\\ngtr": { mode: "M" },
        "\\ni": { mode: "M" },
        "\\nleftarrow": { mode: "M" },
        "\\nLeftarrow": { mode: "M" },
        "\\nLeftrightarrow": { mode: "M" },
        "\\nleftrightarrow": { mode: "M" },
        "\\nleq": { mode: "M" },
        "\\nleqq": { mode: "M" },
        "\\nleqslant": { mode: "M" },
        "\\nless": { mode: "M" },
        "\\nmid": { mode: "M" },
        "\\nobreak": { mode: "M" },
        "\\nobreakspace": { mode: "M" },
        "\\noexpand": { mode: "M" },
        "\\nolimits": { mode: "M" },
        "\\normalsize": { mode: "M" },
        "\\not": { mode: "M" },
        "\\notin": { mode: "M" },
        "\\notni": { mode: "M" },
        "\\nparallel": { mode: "M" },
        "\\nprec": { mode: "M" },
        "\\npreceq": { mode: "M" },
        "\\nRightarrow": { mode: "M" },
        "\\nrightarrow": { mode: "M" },
        "\\nshortmid": { mode: "M" },
        "\\nshortparallel": { mode: "M" },
        "\\nsim": { mode: "M" },
        "\\nsubseteq": { mode: "M" },
        "\\nsubseteqq": { mode: "M" },
        "\\nsucc": { mode: "M" },
        "\\nsucceq": { mode: "M" },
        "\\nsupseteq": { mode: "M" },
        "\\nsupseteqq": { mode: "M" },
        "\\ntriangleleft": { mode: "M" },
        "\\ntrianglelefteq": { mode: "M" },
        "\\ntriangleright": { mode: "M" },
        "\\ntrianglerighteq": { mode: "M" },
        "\\Nu": { mode: "M" },
        "\\nu": { mode: "M" },
        "\\nVDash": { mode: "M" },
        "\\nVdash": { mode: "M" },
        "\\nvDash": { mode: "M" },
        "\\nvdash": { mode: "M" },
        "\\nwarrow": { mode: "M" },
        "\\odot": { mode: "M" },
        "\\oiiint": { mode: "M" },
        "\\oiint": { mode: "M" },
        "\\oint": { mode: "M" },
        "\\omega": { mode: "M" },
        "\\Omega": { mode: "M" },
        "\\Omicron": { mode: "M" },
        "\\omicron": { mode: "M" },
        "\\ominus": { mode: "M" },
        "\\operatorname": { mode: "M" },
        "\\oplus": { mode: "M" },
        "\\oslash": { mode: "M" },
        "\\otimes": { mode: "M" },
        "\\over": { mode: "M" },
        "\\overbrace": { mode: "M" },
        "\\overgroup": { mode: "M" },
        "\\overleftarrow": { mode: "M" },
        "\\overleftharpoon": { mode: "M" },
        "\\overleftrightarrow": { mode: "M" },
        "\\overline": { mode: "M" },
        "\\overlinesegment": { mode: "M" },
        "\\Overrightarrow": { mode: "M" },
        "\\overrightarrow": { mode: "M" },
        "\\overrightharpoon": { mode: "M" },
        "\\overset": { mode: "M" },
        "\\owns": { mode: "M" },
        "\\P": { mode: "M" },
        "\\parallel": { mode: "M" },
        "\\partial": { mode: "M" },
        "\\perp": { mode: "M" },
        "\\phantom": { mode: "M" },
        "\\Phi": { mode: "M" },
        "\\phi": { mode: "M" },
        "\\Pi": { mode: "M" },
        "\\pi": { mode: "M" },
        "\\pitchfork": { mode: "M" },
        "\\plim": { mode: "M" },
        "\\plusmn": { mode: "M" },
        "\\pm": { mode: "M" },
        "\\pmb": { mode: "M" },
        "\\pmod": { mode: "M" },
        "\\pod": { mode: "M" },
        "\\pounds": { mode: "M" },
        "\\Pr": { mode: "M" },
        "\\prec": { mode: "M" },
        "\\precapprox": { mode: "M" },
        "\\preccurlyeq": { mode: "M" },
        "\\preceq": { mode: "M" },
        "\\precnapprox": { mode: "M" },
        "\\precneqq": { mode: "M" },
        "\\precnsim": { mode: "M" },
        "\\precsim": { mode: "M" },
        "\\prime": { mode: "M" },
        "\\prod": { mode: "M" },
        "\\propto": { mode: "M" },
        "\\providecommand": { mode: "M" },
        "\\psi": { mode: "M" },
        "\\Psi": { mode: "M" },
        "\\R": { mode: "M" },
        "\\raisebox": { mode: "M" },
        "\\rang": { mode: "M" },
        "\\rangle": { mode: "M" },
        "\\Rarr": { mode: "M" },
        "\\rArr": { mode: "M" },
        "\\rarr": { mode: "M" },
        "\\rBrace": { mode: "M" },
        "\\rbrace": { mode: "M" },
        "\\rbrack": { mode: "M" },
        "\\rceil": { mode: "M" },
        "\\Re": { mode: "M" },
        "\\real": { mode: "M" },
        "\\Reals": { mode: "M" },
        "\\reals": { mode: "M" },
        "\\relax": { mode: "M" },
        "\\hail": { mode: "M" },
        "\\restriction": { mode: "M" },
        "\\rfloor": { mode: "M" },
        "\\rgroup": { mode: "M" },
        "\\rhd": { mode: "M" },
        "\\Rho": { mode: "M" },
        "\\rho": { mode: "M" },
        "\\right": { mode: "M" },
        "\\Rightarrow": { mode: "M" },
        "\\rightarrow": { mode: "M" },
        "\\rightarrowtail": { mode: "M" },
        "\\rightharpoondown": { mode: "M" },
        "\\rightharpoonup": { mode: "M" },
        "\\rightleftarrows": { mode: "M" },
        "\\rightleftharpoons": { mode: "M" },
        "\\rightrightarrows": { mode: "M" },
        "\\rightsquigarrow": { mode: "M" },
        "\\rightthreetimes": { mode: "M" },
        "\\risingdotseq": { mode: "M" },
        "\\rlap": { mode: "M" },
        "\\rmoustache": { mode: "M" },
        "\\rparen": { mode: "M" },
        "\\rq": { mode: "M" },
        "\\rrbracket": { mode: "M" },
        "\\Rrightarrow": { mode: "M" },
        "\\Rsh": { mode: "M" },
        "\\rtimes": { mode: "M" },
        "\\rule": { mode: "M" },
        "\\rVert": { mode: "M" },
        "\\rvert": { mode: "M" },
        "\\scriptscriptstyle": { mode: "M" },
        "\\scriptsize": { mode: "M" },
        "\\scriptstyle": { mode: "M" },
        "\\sdot": { mode: "M" },
        "\\searrow": { mode: "M" },
        "\\sec": { mode: "M" },
        "\\sect": { mode: "M" },
        "\\setminus": { mode: "M" },
        "\\sf": { mode: "M" },
        "\\sharp": { mode: "M" },
        "\\shortmid": { mode: "M" },
        "\\shortparallel": { mode: "M" },
        "\\Sigma": { mode: "M" },
        "\\sigma": { mode: "M" },
        "\\sim": { mode: "M" },
        "\\simeq": { mode: "M" },
        "\\sin": { mode: "M" },
        "\\sinh": { mode: "M" },
        "\\sixptsize": { mode: "M" },
        "\\sh": { mode: "M" },
        "\\small": { mode: "M" },
        "\\smallfrown": { mode: "M" },
        "\\smallint": { mode: "M" },
        "\\smallsetminus": { mode: "M" },
        "\\smallsmile": { mode: "M" },
        "\\smash": { mode: "M" },
        "\\smile": { mode: "M" },
        "\\sout": { mode: "M" },
        "\\space": { mode: "M" },
        "\\spades": { mode: "M" },
        "\\spadesuit": { mode: "M" },
        "\\sphericalangle": { mode: "M" },
        "\\sqcap": { mode: "M" },
        "\\sqcup": { mode: "M" },
        "\\square": { mode: "M" },
        "\\sqrt": { mode: "M" },
        "\\sqsubset": { mode: "M" },
        "\\sqsubseteq": { mode: "M" },
        "\\sqsupset": { mode: "M" },
        "\\sqsupseteq": { mode: "M" },
        "\\stackrel": { mode: "M" },
        "\\star": { mode: "M" },
        "\\sub": { mode: "M" },
        "\\sube": { mode: "M" },
        "\\Subset": { mode: "M" },
        "\\subset": { mode: "M" },
        "\\subseteq": { mode: "M" },
        "\\subseteqq": { mode: "M" },
        "\\subsetneq": { mode: "M" },
        "\\subsetneqq": { mode: "M" },
        "\\substack": { mode: "M" },
        "\\succ": { mode: "M" },
        "\\succapprox": { mode: "M" },
        "\\succcurlyeq": { mode: "M" },
        "\\succeq": { mode: "M" },
        "\\succnapprox": { mode: "M" },
        "\\succneqq": { mode: "M" },
        "\\succnsim": { mode: "M" },
        "\\succsim": { mode: "M" },
        "\\sum": { mode: "M" },
        "\\sup": { mode: "M" },
        "\\supe": { mode: "M" },
        "\\Supset": { mode: "M" },
        "\\supset": { mode: "M" },
        "\\supseteq": { mode: "M" },
        "\\supseteqq": { mode: "M" },
        "\\supsetneq": { mode: "M" },
        "\\supsetneqq": { mode: "M" },
        "\\surd": { mode: "M" },
        "\\swarrow": { mode: "M" },
        "\\tag": { mode: "M" },
        "\\tan": { mode: "M" },
        "\\tanh": { mode: "M" },
        "\\Tau": { mode: "M" },
        "\\tau": { mode: "M" },
        "\\tbinom": { mode: "M" },
        "\\TeX": { mode: "M" },
        "\\text": { mode: "M" },
        "\\tfrac": { mode: "M" },
        "\\tg": { mode: "M" },
        "\\th": { mode: "M" },
        "\\therefore": { mode: "M" },
        "\\Theta": { mode: "M" },
        "\\theta": { mode: "M" },
        "\\thetasym": { mode: "M" },
        "\\thickapprox": { mode: "M" },
        "\\thicksim": { mode: "M" },
        "\\thickspace": { mode: "M" },
        "\\thinspace": { mode: "M" },
        "\\tilde": { mode: "M" },
        "\\times": { mode: "M" },
        "\\tiny": { mode: "M" },
        "\\to": { mode: "M" },
        "\\top": { mode: "M" },
        "\\triangle": { mode: "M" },
        "\\triangledown": { mode: "M" },
        "\\triangleleft": { mode: "M" },
        "\\trianglelefteq": { mode: "M" },
        "\\triangleq": { mode: "M" },
        "\\triangleright": { mode: "M" },
        "\\trianglerighteq": { mode: "M" },
        "\\tt": { mode: "M" },
        "\\twoheadleftarrow": { mode: "M" },
        "\\twoheadrightarrow": { mode: "M" },
        "\\Uarr": { mode: "M" },
        "\\uArr": { mode: "M" },
        "\\uarr": { mode: "M" },
        "\\ulcorner": { mode: "M" },
        "\\underbrace": { mode: "M" },
        "\\undergroup": { mode: "M" },
        "\\underleftarrow": { mode: "M" },
        "\\underleftrightarrow": { mode: "M" },
        "\\underline": { mode: "M" },
        "\\underlinesegment": { mode: "M" },
        "\\underrightarrow": { mode: "M" },
        "\\underset": { mode: "M" },
        "\\unlhd": { mode: "M" },
        "\\unrhd": { mode: "M" },
        "\\Uparrow": { mode: "M" },
        "\\uparrow": { mode: "M" },
        "\\Updownarrow": { mode: "M" },
        "\\updownarrow": { mode: "M" },
        "\\upharpoonleft": { mode: "M" },
        "\\upharpoonright": { mode: "M" },
        "\\uplus": { mode: "M" },
        "\\Upsilon": { mode: "M" },
        "\\upsilon": { mode: "M" },
        "\\upuparrows": { mode: "M" },
        "\\urcorner": { mode: "M" },
        "\\utilde": { mode: "M" },
        "\\varDelta": { mode: "M" },
        "\\varepsilon": { mode: "M" },
        "\\varGamma": { mode: "M" },
        "\\varkappa": { mode: "M" },
        "\\varLambda": { mode: "M" },
        "\\varnothing": { mode: "M" },
        "\\varOmega": { mode: "M" },
        "\\varPhi": { mode: "M" },
        "\\varphi": { mode: "M" },
        "\\varPi": { mode: "M" },
        "\\varpi": { mode: "M" },
        "\\varpropto": { mode: "M" },
        "\\varPsi": { mode: "M" },
        "\\varrho": { mode: "M" },
        "\\varSigma": { mode: "M" },
        "\\varsigma": { mode: "M" },
        "\\varsubsetneq": { mode: "M" },
        "\\varsubsetneqq": { mode: "M" },
        "\\varsupsetneq": { mode: "M" },
        "\\varsupsetneqq": { mode: "M" },
        "\\varTheta": { mode: "M" },
        "\\vartheta": { mode: "M" },
        "\\vartriangle": { mode: "M" },
        "\\vartriangleleft": { mode: "M" },
        "\\vartriangleright": { mode: "M" },
        "\\varUpsilon": { mode: "M" },
        "\\varXi": { mode: "M" },
        "\\vcentcolon": { mode: "M" },
        "\\Vdash": { mode: "M" },
        "\\vDash": { mode: "M" },
        "\\vdash": { mode: "M" },
        "\\vdots": { mode: "M" },
        "\\vec": { mode: "M" },
        "\\vee": { mode: "M" },
        "\\veebar": { mode: "M" },
        "\\verb": { mode: "M" },
        "\\Vert": { mode: "M" },
        "\\vert": { mode: "M" },
        "\\vphantom": { mode: "M" },
        "\\Vvdash": { mode: "M" },
        "\\wedge": { mode: "M" },
        "\\weierp": { mode: "M" },
        "\\widecheck": { mode: "M" },
        "\\widehat": { mode: "M" },
        "\\widetilde": { mode: "M" },
        "\\wp": { mode: "M" },
        "\\wr": { mode: "M" },
        "\\xcancel": { mode: "M" },
        "\\xdef": { mode: "M" },
        "\\Xi": { mode: "M" },
        "\\xi": { mode: "M" },
        "\\xhookleftarrow": { mode: "M" },
        "\\xhookrightarrow": { mode: "M" },
        "\\xLeftarrow": { mode: "M" },
        "\\xleftarrow": { mode: "M" },
        "\\xleftharpoondown": { mode: "M" },
        "\\xleftharpoonup": { mode: "M" },
        "\\xLeftrightarrow": { mode: "M" },
        "\\xleftrightarrow": { mode: "M" },
        "\\xleftrightharpoons": { mode: "M" },
        "\\xlongequal": { mode: "M" },
        "\\xmapsto": { mode: "M" },
        "\\xRightarrow": { mode: "M" },
        "\\xrightarrow": { mode: "M" },
        "\\xrightharpoondown": { mode: "M" },
        "\\xrightharpoonup": { mode: "M" },
        "\\xrightleftharpoons": { mode: "M" },
        "\\xtofrom": { mode: "M" },
        "\\xtwoheadleftarrow": { mode: "M" },
        "\\xtwoheadrightarrow": { mode: "M" },
        "\\yen": { mode: "M" },
        "\\Z": { mode: "M" },
        "\\Zeta": { mode: "M" },
        "\\zeta": { mode: "M" },
      }),
      (o.environmentDictionary = {
        align: { mode: "T" },
        "align*": { mode: "T" },
        alignat: { mode: "T", signature: "{数量}" },
        "alignat*": { mode: "T", signature: "{列格式}" },
        center: { mode: "T" },
        corollary: { mode: "T" },
        definition: { mode: "T" },
        enumerate: { mode: "T" },
        equation: { mode: "T" },
        "equation*": { mode: "T" },
        flushleft: { mode: "T" },
        flushright: { mode: "T" },
        gather: { mode: "T" },
        "gather*": { mode: "T" },
        itemize: { mode: "T" },
        lemma: { mode: "T" },
        plaintable: { mode: "T", signature: "{列格式}" },
        proof: { mode: "T" },
        proposition: { mode: "T" },
        references: { mode: "T" },
        remark: { mode: "T" },
        structure: { mode: "T" },
        tabular: { mode: "T", signature: "{列格式}" },
        thebibliography: { mode: "T" },
        theorem: { mode: "T" },
        tikzcd: { mode: "T" },
        tikzpicture: { mode: "T" },
        aligned: { mode: "M" },
        alignedat: { mode: "M" },
        array: { mode: "M", signature: "{列格式}" },
        Bmatrix: { mode: "M" },
        bmatrix: { mode: "M" },
        cases: { mode: "M" },
        darray: { mode: "M" },
        dcases: { mode: "M" },
        drcases: { mode: "M" },
        gathered: { mode: "M" },
        matrix: { mode: "M" },
        pmatrix: { mode: "M" },
        rcases: { mode: "M" },
        smallmatrix: { mode: "M" },
        Vmatrix: { mode: "M" },
        vmatrix: { mode: "M" },
      }),
      (o.snippetDictionary = {
        "\\bigl( ... \\bigr)": {
          mode: "M",
          insertText: "\\bigl( ${0} \\bigr)",
        },
        "\\bigl[ ... \\bigr]": {
          mode: "M",
          insertText: "\\bigl[ ${0} \\bigr]",
        },
        "\\bigl\\{ ... \\bigr\\}": {
          mode: "M",
          insertText: "\\bigl\\\\{ ${0} \\bigr\\\\}",
        },
        "\\bigl| ... \\bigr|": {
          mode: "M",
          insertText: "\\bigl| ${0} \\bigr|",
        },
        "\\Bigl( ... \\Bigr)": {
          mode: "M",
          insertText: "\\Bigl( ${0} \\Bigr)",
        },
        "\\Bigl[ ... \\Bigr]": {
          mode: "M",
          insertText: "\\Bigl[ ${0} \\Bigr]",
        },
        "\\Bigl\\{ ... \\Bigr\\}": {
          mode: "M",
          insertText: "\\Bigl\\\\{ ${0} \\Bigr\\\\}",
        },
        "\\Bigl| ... \\Bigr|": {
          mode: "M",
          insertText: "\\Bigl| ${0} \\Bigr|",
        },
        "\\biggl( ... \\biggr)": {
          mode: "M",
          insertText: "\\biggl( ${0} \\biggr)",
        },
        "\\biggl[ ... \\biggr]": {
          mode: "M",
          insertText: "\\biggl[ ${0} \\biggr]",
        },
        "\\biggl\\{ ... \\biggr\\}": {
          mode: "M",
          insertText: "\\biggl\\\\{ ${0} \\biggr\\\\}",
        },
        "\\biggl| ... \\biggr|": {
          mode: "M",
          insertText: "\\biggl| ${0} \\biggr|",
        },
        "\\Biggl( ... \\Biggr)": {
          mode: "M",
          insertText: "\\Biggl( ${0} \\Biggr)",
        },
        "\\Biggl[ ... \\Biggr]": {
          mode: "M",
          insertText: "\\Biggl[ ${0} \\Biggr]",
        },
        "\\Biggl\\{ ... \\Biggr\\}": {
          mode: "M",
          insertText: "\\Biggl\\\\{ ${0} \\Biggr\\\\}",
        },
        "\\Biggl| ... \\Biggr|": {
          mode: "M",
          insertText: "\\Biggl| ${0} \\Biggr|",
        },
        "\\langle ... \\rangle": {
          mode: "M",
          insertText: "\\langle ${0} \\rangle",
        },
        "\\left( ... \\right)": {
          mode: "M",
          insertText: "\\left( ${0} \\right)",
        },
        "\\left[ ... \\right]": {
          mode: "M",
          insertText: "\\left[ ${0} \\right]",
        },
        "\\left\\{ ... \\right\\}": {
          mode: "M",
          insertText: "\\left\\\\{ ${0} \\right\\\\}",
        },
        "\\left| ... \\right|": {
          mode: "M",
          insertText: "\\left| ${0} \\right|",
        },
      }),
      (o.strings = { zh: { "unmatched-bracket": "'${1}' 没有配对。" } }),
      (o.getString = function (e, ...n) {
        var r;
        let i = (null !== (r = o.strings[t.options.locale]) && void 0 !== r
          ? r
          : o.strings.zh)[e];
        if (!i) return "";
        let d = i;
        d = d.replace(/\$(_+)\{/g, "$$__$1{");
        for (let e = 0; e < n.length; e++)
          d = d.replace(
            "${" + (e + 1) + "}",
            n[e].replace(/\$(_*)\{/g, "$$__$1{")
          );
        return d.replace(/\$__(_*)\{/g, "$$$1{");
      }),
      (o.imports = []);
  }),
  define("lib/StructureAnalyser", [
    "require",
    "exports",
    "lib/common",
  ], function (e, o, t) {
    "use strict";
    Object.defineProperty(o, "__esModule", { value: !0 }),
      (o.btexStructureAnalyser = void 0),
      (o.btexStructureAnalyser = {
        analyse: function (e, o) {
          var n, r, i;
          let d = {},
            m =
              null !== (n = null == o ? void 0 : o.startLineNumber) &&
              void 0 !== n
                ? n
                : 1,
            a =
              null !== (r = null == o ? void 0 : o.endLineNumber) &&
              void 0 !== r
                ? r
                : e.getLineCount();
          for (let o = m; o <= a; o++) {
            (null !== (i = d[o]) && void 0 !== i) || (d[o] = []);
            let n = d[o],
              r = e.getLineContent(o);
            if (r.length > t.options.maxParsedLineLength) continue;
            r = r.replace(/\\\\/g, "  ").replace(/(^|[^\\])%.*/, "$1");
            let m = 1;
            for (; r.length > 0; )
              switch (r[0]) {
                case "{":
                case "}":
                case "$":
                  n.push({ tag: r[0], startColumn: m, endColumn: m + 1 }),
                    (r = r.substring(1)),
                    m++;
                  continue;
                case "\\":
                  if ("[]()".includes(r[1])) {
                    n.push({
                      tag: "\\" + r[1],
                      startColumn: m,
                      endColumn: m + 2,
                    }),
                      (r = r.substring(2)),
                      (m += 2);
                    continue;
                  }
                  let e = r.match(/^\\(begin|end)\s*(\{[^\{\}\\]*\})/);
                  if (e) {
                    n.push({
                      tag: "\\" + e[1] + e[2],
                      startColumn: m,
                      endColumn: m + e[0].length,
                    }),
                      (r = r.substring(e[0].length)),
                      (m += e[0].length);
                    continue;
                  }
                  if (
                    (e =
                      r.match(
                        /^(\\@?(re)?newcommand(\s*\*)?)\s*\{\s*(\\[a-zA-Z]+|.?)?\s*\}/
                      ) ||
                      r.match(/^(\\@?([aegpt@]?def|(re)?newcommand(\s*\*)?))/))
                  ) {
                    n.push({
                      tag: "def",
                      startColumn: m,
                      endColumn: m + e[1].length,
                    }),
                      (r = r.substring(e[1].length)),
                      (m += e[1].length);
                    continue;
                  }
                  if (
                    (e = r.match(
                      /^\\(?:@?env[ap]?(def)|(re)?newenvironment(\s*\*)?)/
                    ))
                  ) {
                    n.push({
                      tag: "def" === e[1] ? "envdef" : "newenv",
                      startColumn: m,
                      endColumn: m + e[0].length,
                    }),
                      (r = r.substring(e[0].length)),
                      (m += e[0].length);
                    continue;
                  }
                  (r = r.substring(2)), (m += 2);
                  continue;
                case "#":
                  let o = r.match(/^#+.?/),
                    t = o ? o[0].length : 1;
                  (r = r.substring(t)), (m += t);
                  continue;
                default:
                  (r = r.substring(1)), m++;
                  continue;
              }
          }
          return d;
        },
      });
  }),
  define("lib/structure", [
    "require",
    "exports",
    "monaco-editor",
    "lib/data",
  ], function (e, o, t, n) {
    "use strict";
    function r(e, o, t) {
      if (t <= 0) return o;
      let n = e._analyserResult;
      if (!n) return;
      let r = 0,
        i = n[o.lineNumber];
      for (; r < i.length && i[r].startColumn < o.column; ) r++;
      let d = 0,
        m = e.getLineCount();
      for (let e = o.lineNumber; e <= m; e++) {
        let i = n[e];
        for (let n = e === o.lineNumber ? r : 0; n < i.length; n++)
          if ("{" === i[n].tag) d++;
          else if ("}" === i[n].tag) {
            if (0 === --d && 0 === --t)
              return { lineNumber: e, column: i[n].startColumn };
            if (-1 === d) return;
          }
      }
    }
    function i(e, o) {
      return {
        startLineNumber: o,
        endLineNumber: o,
        startColumn: e.startColumn,
        endColumn: e.endColumn,
      };
    }
    function d(e) {
      return "{" === e
        ? "}"
        : "\\(" === e
        ? "\\)"
        : "\\[" === e
        ? "\\]"
        : e.startsWith("\\begin")
        ? e.replace("\\begin", "\\end")
        : "";
    }
    Object.defineProperty(o, "__esModule", { value: !0 }),
      (o.validateModel = o.getHighlightBrackets = o.detectMode = o.jumpOverGroups = o.matchEnvironment = void 0),
      (o.matchEnvironment = function (e, o, t, n) {
        var r;
        if (1 !== n && -1 !== n) return;
        let i = [o],
          d = e._analyserResult;
        if (!d) return;
        let m = 0,
          a = d[t.lineNumber];
        for (; m < a.length && a[m].startColumn < t.column; ) m++;
        if (
          !(
            (null === (r = a[--m]) || void 0 === r ? void 0 : r.endColumn) >=
            t.column
          )
        )
          return;
        let l = e.getLineCount();
        for (let e = t.lineNumber; e > 0 && e <= l; e += n) {
          let o = d[e];
          for (
            let r = e === t.lineNumber ? m + n : 1 === n ? 0 : o.length - 1;
            r >= 0 && r < o.length;
            r += n
          ) {
            let t = o[r].tag.match(/^\\(begin|end)\{([^\{\}\\]*)\}$/);
            if (t)
              if (("begin" === t[1]) == (1 === n)) i.push(t[2]);
              else {
                let n = i.pop();
                if (null !== n && n !== t[2]) return;
                if (0 === i.length)
                  return {
                    lineNumber: e,
                    column: o[r].endColumn - t[2].length - 1,
                  };
              }
          }
        }
      }),
      (o.jumpOverGroups = r),
      (o.detectMode = function (e, o) {
        var t, i;
        let d = e._analyserResult;
        if (!d) return "T";
        let m = [];
        for (let a = 1; a <= o.lineNumber; a++) {
          let l = d[a];
          a === o.lineNumber && (l = l.filter((e) => e.endColumn <= o.column));
          for (let s = 0; s < l.length; s++) {
            let u = l[s];
            if ("$" === u.tag) {
              let e =
                "$" ===
                  (null === (t = l[s + 1]) || void 0 === t ? void 0 : t.tag) &&
                (null === (i = l[s + 1]) || void 0 === i
                  ? void 0
                  : i.startColumn) === u.endColumn;
              m.length > 0 && "$" === m[m.length - 1]
                ? m.pop()
                : m.length > 0 && e && "$$" === m[m.length - 1]
                ? (m.pop(), s++)
                : (m.push(e ? "$$" : "$"), e && s++);
            } else if ("\\(" === u.tag) m.push("\\(");
            else if ("\\[" === u.tag) m.push("\\[");
            else if ("{" === u.tag) m.push("{");
            else if ("\\)" === u.tag) "\\(" === m[m.length - 1] && m.pop();
            else if ("\\]" === u.tag) "\\[" === m[m.length - 1] && m.pop();
            else if ("}" === u.tag) for (; m.length > 0 && "{" !== m.pop(); );
            else if (u.tag.startsWith("\\begin")) {
              let e = u.tag.substring(7, u.tag.length - 1);
              n.mathEnvironments.join("|").includes(e) &&
                !e.includes("|") &&
                m.push(e);
            } else if (u.tag.startsWith("\\end")) {
              let e = u.tag.substring(5, u.tag.length - 1);
              m.length > 0 && m[m.length - 1] === e && m.pop();
            } else if (
              "def" === u.tag ||
              "newenv" === u.tag ||
              "envdef" === u.tag
            ) {
              let t = r(
                e,
                { lineNumber: a, column: u.startColumn },
                "def" === u.tag ? 1 : "newenv" === u.tag ? 3 : 4
              );
              if (t) {
                if (
                  ((l = d[(a = t.lineNumber)]),
                  a > o.lineNumber ||
                    (a === o.lineNumber && t.column >= o.column))
                )
                  return "T";
                for (
                  a === o.lineNumber &&
                    (l = l.filter((e) => e.endColumn <= o.column)),
                    s = 0;
                  l[s] && l[s].startColumn <= t.column;

                )
                  s++;
                s--;
              }
            }
          }
        }
        return m.filter((e) => "{" !== e).length > 0 ? "M" : "T";
      }),
      (o.getHighlightBrackets = function (e, o) {
        var t, n;
        let r = [],
          m = e._analyserResult;
        if (!m) return [];
        let a = e.getLineCount(),
          l = !1;
        for (let e = 1; e <= a; e++) {
          let a = m[e];
          for (let m = 0; m < a.length; m++) {
            let s = a[m],
              u =
                e === o.lineNumber &&
                s.startColumn <= o.column &&
                s.endColumn >= o.column;
            if (
              !l &&
              (e > o.lineNumber ||
                (e === o.lineNumber && s.startColumn > o.column))
            ) {
              if (!(r.length > 0)) return [];
              for (let e of r) e.enclosesCursor = !0;
              l = !0;
            }
            if ("$" === s.tag) {
              let d =
                "$" ===
                  (null === (t = a[m + 1]) || void 0 === t ? void 0 : t.tag) &&
                (null === (n = a[m + 1]) || void 0 === n
                  ? void 0
                  : n.startColumn) === s.endColumn;
              if (
                r.length > 0 &&
                ("$" === r[r.length - 1].tag ||
                  (d && "$$" === r[r.length - 1].tag))
              ) {
                let t = "$" === r[r.length - 1].tag;
                u ||
                  (u =
                    !t && e === o.lineNumber && s.startColumn === o.column - 2);
                let n = r.pop();
                if (n && ((null == n ? void 0 : n.enclosesCursor) || u))
                  return [
                    i(n, n.line),
                    i(
                      {
                        startColumn: s.startColumn,
                        endColumn: t ? s.endColumn : s.startColumn + 2,
                      },
                      e
                    ),
                  ];
                t || m++;
              } else
                r.push(
                  d
                    ? {
                        line: e,
                        startColumn: s.startColumn,
                        endColumn: s.startColumn + 2,
                        tag: "$$",
                      }
                    : Object.assign({ line: e }, s)
                ),
                  d && m++;
            } else if (
              "\\(" === s.tag ||
              "\\[" === s.tag ||
              "{" === s.tag ||
              s.tag.startsWith("\\begin")
            )
              r.push(Object.assign({ line: e }, s));
            else if (
              "\\)" === s.tag ||
              "\\]" === s.tag ||
              "}" === s.tag ||
              s.tag.startsWith("\\end")
            ) {
              let o = [...r];
              for (; r.length > 0; ) {
                let t = r.pop();
                if (t && d(t.tag) === s.tag) {
                  if ((null == t ? void 0 : t.enclosesCursor) || u)
                    return [i(t, t.line), i(s, e)];
                  o = r;
                  break;
                }
              }
              r = o;
            }
            if (u) {
              if (!(r.length > 0)) return [];
              for (let e of r) e.enclosesCursor = !0;
              l = !0;
            }
          }
        }
        return [];
      }),
      (o.validateModel = function (e, o) {
        var m, a;
        let l = [],
          s = [],
          u = e._analyserResult;
        if (!u) return;
        let g = e.getLineCount(),
          c = void 0;
        for (let o = 1; o <= g; o++) {
          let g = u[o];
          for (let u = 0; u < g.length; u++) {
            let M = g[u],
              f =
                c &&
                (c.lineNumber > o ||
                  (c.lineNumber === o && c.column > M.startColumn));
            if ("$" === M.tag) {
              let e =
                "$" ===
                  (null === (m = g[u + 1]) || void 0 === m ? void 0 : m.tag) &&
                (null === (a = g[u + 1]) || void 0 === a
                  ? void 0
                  : a.startColumn) === M.endColumn;
              l.length > 0 &&
              ("$" === l[l.length - 1].tag ||
                (e && "$$" === l[l.length - 1].tag))
                ? ("$" !== l[l.length - 1].tag && u++, l.pop())
                : (l.push(
                    e
                      ? {
                          line: o,
                          startColumn: M.startColumn,
                          endColumn: M.startColumn + 2,
                          tag: "$$",
                        }
                      : Object.assign({ line: o }, M)
                  ),
                  e && u++);
            } else if (
              "{" === M.tag ||
              (!f &&
                ("\\(" === M.tag ||
                  "\\[" === M.tag ||
                  M.tag.startsWith("\\begin")))
            )
              l.push(Object.assign({ line: o }, M));
            else if (
              "}" === M.tag ||
              (!f &&
                ("\\)" === M.tag ||
                  "\\]" === M.tag ||
                  M.tag.startsWith("\\end")))
            ) {
              let e = [...l],
                r = [];
              for (; l.length > 0; ) {
                let o = l.pop();
                if (o) {
                  if (d(o.tag) === M.tag) {
                    e = l;
                    break;
                  }
                  r.push(
                    Object.assign(Object.assign({}, i(o, o.line)), {
                      severity: t.MarkerSeverity.Error,
                      message: n.getString("unmatched-bracket", o.tag),
                    })
                  );
                }
              }
              l === e
                ? s.push(...r)
                : (s.push(
                    Object.assign(Object.assign({}, i(M, o)), {
                      severity: t.MarkerSeverity.Error,
                      message: n.getString("unmatched-bracket", M.tag),
                    })
                  ),
                  (l = e));
            } else
              f ||
                ("def" !== M.tag && "newenv" !== M.tag && "envdef" !== M.tag) ||
                (c = r(
                  e,
                  { lineNumber: o, column: M.startColumn },
                  "def" === M.tag ? 1 : "newenv" === M.tag ? 3 : 4
                ));
          }
        }
        for (let e of l)
          s.push(
            Object.assign(Object.assign({}, i(e, e.line)), {
              severity: t.MarkerSeverity.Error,
              message: n.getString("unmatched-bracket", e.tag),
            })
          );
        t.editor.setModelMarkers(e, o, s);
      });
  }),
  define("lib/CompletionItemProvider", [
    "require",
    "exports",
    "monaco-editor",
    "lib/common",
    "lib/data",
    "lib/structure",
  ], function (e, o, t, n, r, i) {
    "use strict";
    Object.defineProperty(o, "__esModule", { value: !0 }),
      (o.btexCompletionItemProvider = void 0),
      (o.btexCompletionItemProvider = {
        triggerCharacters: ["\\"],
        provideCompletionItems: function (e, o) {
          var d, m, a, l, s, u, g, c, M, f;
          let h = [],
            p = e.getWordUntilPosition(o).word,
            b =
              null === (d = e.getWordAtPosition(o)) || void 0 === d
                ? void 0
                : d.word,
            v = e.getValueInRange({
              startLineNumber: o.lineNumber,
              endLineNumber: o.lineNumber,
              startColumn: 1,
              endColumn: o.column,
            }),
            x = e.getLineContent(o.lineNumber).substring(v.length),
            w = v.match(/\\(?:begin|end)\s*\{([^\{\}\\\ud800-\udfff]*)$/);
          if (w) {
            let d = x.match(/([^\{\}\\\ud800-\udfff]*)\}/),
              s = !d,
              u = {
                startLineNumber: o.lineNumber,
                endLineNumber: o.lineNumber,
                startColumn: o.column - w[1].length,
                endColumn: o.column + (d ? d[1].length + 1 : 0),
              },
              g = i.detectMode(e, o);
            for (let e in r.environmentDictionary) {
              let o = r.environmentDictionary[e];
              ("T" === g && "M" === o.mode) ||
                h.push({
                  kind:
                    null !== (m = o.kind) && void 0 !== m
                      ? m
                      : t.languages.CompletionItemKind.Module,
                  label: e,
                  insertText: s ? e + "}${0}\\end{" + e + "}" : e + "}",
                  insertTextRules:
                    null !== (a = o.insertTextRules) && void 0 !== a
                      ? a
                      : t.languages.CompletionItemInsertTextRule
                          .InsertAsSnippet,
                  range: u,
                  detail:
                    `\\begin{${e}}` +
                    (null !== (l = o.signature) && void 0 !== l ? l : ""),
                  tags: o.deprecated
                    ? [t.languages.CompletionItemTag.Deprecated]
                    : void 0,
                });
            }
            let c = (function (e, o) {
              const i = new RegExp(
                "(?:" +
                  [...r.envCommands, ...r.envStarCommands]
                    .join("|")
                    .replace(/\\/g, "\\\\")
                    .replace(/\*/g, "\\*") +
                  ")\\s*\\{([a-zA-Z\\*]+)\\}",
                "g"
              );
              let d = new Set(),
                m = !1,
                a = e.getLinesContent(),
                l = t.editor.getModel(t.Uri.file("/preamble"));
              l && a.push(...l.getLinesContent());
              for (let e of a) {
                if (e.length > n.options.maxParsedLineLength) continue;
                let t = e.match(i);
                if (t)
                  for (let e of t) {
                    let t = e.match(/\{([a-zA-Z\*]+)\}/);
                    if (t)
                      if ((e = t[1]) === o) m ? (o = void 0) : (m = !0);
                      else if (
                        (e in r.environmentDictionary || d.has(e) || d.add(e),
                        d.size > n.options.suggestionsLimit)
                      )
                        return d;
                  }
              }
              return d;
            })(e, b);
            for (let e of c)
              h.push({
                kind: t.languages.CompletionItemKind.Module,
                label: e,
                insertText: s ? e + "}${0}\\end{" + e + "}" : e + "}",
                insertTextRules:
                  t.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: u,
                detail: `\\begin{${e}}`,
              });
            return { suggestions: h };
          }
          if (
            /^\\[a-zA-Z]*$/.test(p) &&
            !/(^|[^\\#]|#\\)(\\\\)+[a-zA-Z]*$/.test(v) &&
            !/#\\[a-zA-Z]*$/.test(v)
          ) {
            let d = i.detectMode(e, o.delta(0, -p.length));
            for (let e in r.snippetDictionary) {
              let o = r.snippetDictionary[e];
              ("T" === d && "M" === o.mode) ||
                h.push({
                  kind:
                    null !== (s = o.kind) && void 0 !== s
                      ? s
                      : "M" === o.mode
                      ? t.languages.CompletionItemKind.Field
                      : t.languages.CompletionItemKind.Method,
                  label: e,
                  insertText:
                    null !== (u = o.insertText) && void 0 !== u ? u : e,
                  insertTextRules:
                    t.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                  detail: null !== (g = o.signature) && void 0 !== g ? g : e,
                  tags: o.deprecated
                    ? [t.languages.CompletionItemTag.Deprecated]
                    : void 0,
                });
            }
            for (let e in r.commandDictionary) {
              let o = r.commandDictionary[e];
              ("T" === d && "M" === o.mode) ||
                h.push({
                  kind:
                    null !== (c = o.kind) && void 0 !== c
                      ? c
                      : "M" === o.mode
                      ? t.languages.CompletionItemKind.Field
                      : t.languages.CompletionItemKind.Method,
                  label: e,
                  insertText:
                    null !== (M = o.insertText) && void 0 !== M ? M : e,
                  insertTextRules: o.insertTextRules,
                  detail: null !== (f = o.signature) && void 0 !== f ? f : e,
                  tags: o.deprecated
                    ? [t.languages.CompletionItemTag.Deprecated]
                    : void 0,
                });
            }
            let m = (function (e, o) {
              const i = /\\([a-zA-Z]+)/g;
              let d = new Set(),
                m = e.getLinesContent(),
                a = t.editor.getModel(t.Uri.file("/preamble"));
              a && m.push(...a.getLinesContent());
              for (let e of m) {
                if (e.length > n.options.maxParsedLineLength) continue;
                let t = e.match(i);
                if (t)
                  for (let e of t)
                    if (e === o) o = void 0;
                    else if (
                      (e in r.commandDictionary || d.has(e) || d.add(e),
                      d.size > n.options.suggestionsLimit)
                    )
                      return d;
              }
              return d;
            })(e, b);
            for (let e of m)
              h.push({
                kind: t.languages.CompletionItemKind.Method,
                label: e,
                insertText: e,
                detail: e,
              });
            let a = i.matchEnvironment(e, null, o, -1);
            if (a) {
              let o = e
                .getValueInRange({
                  startLineNumber: a.lineNumber,
                  endLineNumber: a.lineNumber,
                  startColumn: a.column,
                  endColumn: e.getLineLength(a.lineNumber) + 1,
                })
                .match(/^[^\{\}\\]*(?=\})/);
              o &&
                (h = h.filter((e) => "\\end" !== e.label)).push({
                  kind: t.languages.CompletionItemKind.Method,
                  label: `\\end{${o[0]}}`,
                  insertText: `\\end{${o[0]}}`,
                  detail: `\\end{${o[0]}}`,
                });
            }
          }
          return { suggestions: h };
        },
      });
  }),
  define("lib/handlers", [
    "require",
    "exports",
    "monaco-editor",
    "diff",
    "lib/common",
    "lib/structure",
    "lib/StructureAnalyser",
  ], function (e, o, t, n, r, i, d) {
    "use strict";
    function m(e, o) {
      (o && o.reason !== t.editor.CursorChangeReason.Explicit) ||
        setTimeout(() => {
          var o;
          let n = e.getModel(),
            r = e.getPosition();
          if (!n || !r) return;
          let d =
              null !== (o = n._bracketsDecorations) && void 0 !== o ? o : [],
            m = i.getHighlightBrackets(n, r),
            a = n.deltaDecorations(
              d,
              m.map((e) => ({
                options: {
                  className: "bracket-match",
                  stickiness:
                    t.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
                },
                range: e,
              }))
            );
          n._bracketsDecorations = a;
        }, 0);
    }
    Object.defineProperty(o, "__esModule", { value: !0 }),
      (o.onDidChangeCursorPosition = o.onDidChangeModelContent = void 0),
      (o.onDidChangeModelContent = function (e, o) {
        var a;
        let l = o.changes;
        if (l.length > 1) {
          let o = null !== (a = e._oldValue) && void 0 !== a ? a : "";
          var s = t.editor.createModel(o, "btex");
          l = l.filter(
            (e) =>
              !(
                "" === e.text &&
                e.range.startLineNumber === e.range.endLineNumber &&
                1 === e.range.startColumn &&
                e.range.endColumn ===
                  s.getLineLength(e.range.startLineNumber) + 1 &&
                /^\s+$/.test(s.getLineContent(e.range.startLineNumber))
              )
          );
        }
        let u = e._validateTimeout;
        void 0 !== u && clearTimeout(u),
          (e._validateTimeout = setTimeout(() => {
            let o = e.getModel();
            o && i.validateModel(o, e.getId()), delete e._validateTimeout;
          }, 500)),
          setTimeout(() => {
            var a, u, g, c, M, f, h, p, b, v;
            let x = e.getModel(),
              w = e.getPosition();
            if (!x || !w) return;
            let T = null !== (a = e._oldValue) && void 0 !== a ? a : "";
            e._oldValue = e.getValue();
            let y = !1;
            for (let e of l)
              if (
                e.range.startLineNumber !== e.range.endLineNumber ||
                e.text.includes("\n")
              ) {
                y = !0;
                break;
              }
            let C = null !== (u = x._analyserResult) && void 0 !== u ? u : {};
            if (y) C = d.btexStructureAnalyser.analyse(x);
            else
              for (let e of l)
                Object.assign(C, d.btexStructureAnalyser.analyse(x, e.range));
            x._analyserResult = C;
            let k = e._diffSource;
            if (void 0 !== k) {
              let o = n.diffLines(k, x.getValue()),
                r = [],
                i = 1,
                d = 0;
              for (let e = 0; e < o.length; e++) {
                let n = o[e];
                if (n.added)
                  r.push({
                    range: new t.Range(
                      i,
                      1,
                      i + (null !== (g = n.count) && void 0 !== g ? g : 1) - 1,
                      1
                    ),
                    options: {
                      isWholeLine: !0,
                      linesDecorationsClassName: "line-dec-added",
                      minimap: {
                        color: "#81b88b",
                        position: t.editor.MinimapPosition.Gutter,
                      },
                    },
                  }),
                    (i += null !== (c = n.count) && void 0 !== c ? c : 1),
                    (d += null !== (M = n.count) && void 0 !== M ? M : 1);
                else if (n.removed) {
                  let m = i;
                  (d += null !== (f = n.count) && void 0 !== f ? f : 1),
                    e + 1 < o.length &&
                      o[e + 1].added &&
                      ((i +=
                        null !== (h = o[e + 1].count) && void 0 !== h ? h : 1),
                      (d +=
                        null !== (p = o[e + 1].count) && void 0 !== p ? p : 1),
                      e++),
                    r.push({
                      range: new t.Range(m, 1, m === i ? i : i - 1, 1),
                      options: {
                        isWholeLine: !0,
                        linesDecorationsClassName:
                          m === i ? "line-dec-removed" : "line-dec-modified",
                        minimap: {
                          color: m === i ? "#ca4b51" : "#66afe0",
                          position: t.editor.MinimapPosition.Gutter,
                        },
                      },
                    });
                } else i += null !== (b = n.count) && void 0 !== b ? b : 1;
              }
              d > 200 && ((r = []), delete e._diffSource);
              let m =
                  null !== (v = x._diffDecorations) && void 0 !== v ? v : [],
                a = e.deltaDecorations(m, r);
              x._diffDecorations = a;
            }
            if (o.isUndoing || o.isRedoing || 1 !== l.length) return;
            let q = x.getValueInRange({
                startLineNumber: w.lineNumber,
                endLineNumber: w.lineNumber,
                startColumn: 1,
                endColumn: w.column,
              }),
              L = x.getLineContent(w.lineNumber);
            if (L.length > r.options.maxParsedLineLength) return;
            let $ = l[0].text;
            if (
              ("$" === $ && q.endsWith("$$") && r.insertText(e, w, "$$"),
              "\\begin{".endsWith($) && q.endsWith("{") && "" !== $)
            )
              return void e.trigger(
                null,
                "editor.action.triggerSuggest",
                void 0
              );
            let N = q.match(/\\begin\s*\{([^\{\}\\\s]*)\}$/);
            N &&
              "}" === $ &&
              !L.substr(q.length).trim().startsWith(`\\end{${N[1]}}`) &&
              r.insertText(e, w, `\\end{${N[1]}}`),
              (N = q.match(/\\begin\s*\{$/)) &&
                "{}" === $ &&
                r.insertText(e, w, "}\\end{}", w, 1);
            let S =
              (N = q.match(/\\(begin|end)\s*\{([^\{\}\\]*)(\}?)$/)) &&
              N[3] &&
              $ === N[2] + "}";
            if (
              N &&
              (S || !N[3]) &&
              (S || $.length <= N[2].length) &&
              l[0].range.endLineNumber === w.lineNumber &&
              l[0].range.startColumn === w.column - l[0].text.length
            ) {
              S ||
                setTimeout(() => {
                  e.trigger(null, "editor.action.triggerSuggest", void 0);
                }, 0);
              let o = (null != s ? s : t.editor.createModel(T, "btex"))
                  .getLineContent(w.lineNumber)
                  .substring(N.index)
                  .match(/\\(begin|end)\s*\{([^\{\}\\]*)\}/),
                n = L.substring(N.index).match(
                  /\\(begin|end)\s*\{([^\{\}\\]*)\}/
                );
              if (o && n) {
                let t = o[2],
                  d = n[2],
                  m = "begin" === n[1] ? 1 : -1,
                  a = i.matchEnvironment(x, t, w, m),
                  l = Object.assign({}, w);
                (null == a ? void 0 : a.lineNumber) === w.lineNumber &&
                  -1 === m &&
                  (l.column += d.length - t.length),
                  a &&
                    /^[^\ud800-\udfff]*$/.test(t) &&
                    r.insertText(e, a, d, l, t.length);
              }
            }
            m(e);
          }, 0);
      }),
      (o.onDidChangeCursorPosition = m);
  }),
  define("lib/LanguageConfiguration", [
    "require",
    "exports",
    "monaco-editor",
  ], function (e, o, t) {
    "use strict";
    Object.defineProperty(o, "__esModule", { value: !0 }),
      (o.btexLanguageConfiguration = void 0),
      (o.btexLanguageConfiguration = {
        autoClosingPairs: [
          { open: "{", close: "}" },
          { open: "[", close: "]" },
          { open: "(", close: ")" },
          { open: "\\{", close: "\\}" },
          { open: "\\[", close: "\\]" },
          { open: "\\(", close: "\\)" },
          { open: "`", close: "'" },
          { open: "$", close: "$", notIn: ["comment"] },
        ],
        surroundingPairs: [
          { open: "{", close: "}" },
          { open: "[", close: "]" },
          { open: "(", close: ")" },
          { open: "`", close: "'" },
          { open: "$", close: "$" },
        ],
        brackets: [],
        comments: { lineComment: "%" },
        indentationRules: {
          increaseIndentPattern: /\\begin\s*\{[^\{\}\\]*\}(?!.*\\(begin|end)\s*\{)/,
          decreaseIndentPattern: /^\s*\\end\s*\{/,
        },
        wordPattern: /\\(@*[a-zA-Z]*)|[^\s\d`~!@#$%^&*()\-=_+[\]{}\\\|;:'"<>,.\/?\u0500-\uffff]+/g,
        onEnterRules: [
          {
            beforeText: /\\begin\s*\{[^\{\}\\]*\}(?!.*\\(begin|end)\s*\{)/,
            afterText: /^\s*\\end\s*\{/,
            action: { indentAction: t.languages.IndentAction.IndentOutdent },
          },
          {
            beforeText: /\\begin\s*\{[^\{\}\\]*\}(?!.*\\(begin|end)\s*\{)/,
            action: { indentAction: t.languages.IndentAction.Indent },
          },
          {
            beforeText: /\$\$\s*$/,
            afterText: /^\s*\$\$/,
            action: { indentAction: t.languages.IndentAction.IndentOutdent },
          },
          {
            beforeText: /\\\[\s*$/,
            afterText: /^\s*\\\]/,
            action: { indentAction: t.languages.IndentAction.IndentOutdent },
          },
          {
            beforeText: /\\\(\s*$/,
            afterText: /^\s*\\\)/,
            action: { indentAction: t.languages.IndentAction.IndentOutdent },
          },
          {
            beforeText: /\{\s*$/,
            afterText: /^\s*\}/,
            action: { indentAction: t.languages.IndentAction.IndentOutdent },
          },
        ],
      });
  }),
  define("lib/TokensProvider", ["require", "exports", "lib/data"], function (
    e,
    o,
    t
  ) {
    "use strict";
    Object.defineProperty(o, "__esModule", { value: !0 }),
      (o.btexTokensProvider = void 0),
      (o.btexTokensProvider = {
        envCommands: t.envCommands,
        envStarCommands: t.envStarCommands,
        mathEnvironments: t.mathEnvironments.map((e) => "{" + e + "}"),
        defaultToken: "text",
        tokenizer: {
          root: [
            { include: "@common" },
            [/\\begin(?=\s*\{)/, "command", "@begin"],
            [
              /\\@?[aegpt@]?def(?![a-zA-Z])/,
              { token: "command", next: "@def.1" },
            ],
            [
              /(\\@?(?:re)?newcommand)(\s*)(\**)(\s*)(\{)(\s*)(\\(?:[a-zA-Z]+|.))(\s*)(\})/,
              [
                "command",
                "",
                "text",
                "",
                "delimiter.curly",
                "",
                "command",
                "",
                { token: "delimiter.curly", next: "@def.1" },
              ],
            ],
            [
              /(\\@?(?:re)?newcommand)(\s*)(\**)(\s*)(\\(?:[a-zA-Z]+|.))/,
              ["command", "", "text", "", { token: "command", next: "@def.1" }],
            ],
            [
              /(\\@?(?:re)?newenvironment)(\s*)(\**)(\s*)(\{)([^\{\}\\]*)(\})/,
              [
                "command",
                "",
                "text",
                "",
                "delimiter.curly",
                "string.env",
                { token: "delimiter.curly", next: "@def.2" },
              ],
            ],
            [
              /(\\@?env[ap]?def)(\s*)(\**)(\s*)(\{)([^\{\}\\]*)(\})/,
              [
                "command",
                "",
                "text",
                "",
                "delimiter.curly",
                "string.env",
                { token: "delimiter.curly", next: "@def.3" },
              ],
            ],
            [
              /(\\@?(?:re)?newenvironment)(\s*)(\**)(\s*)(\{)/,
              [
                "command",
                "",
                "text",
                "",
                { token: "@rematch", next: "@def.3" },
              ],
            ],
            [
              /(\\@?env[ap]?def)(\s*)(\**)(\s*)(\{)/,
              [
                "command",
                "",
                "text",
                "",
                { token: "@rematch", next: "@def.4" },
              ],
            ],
            { include: "@commands" },
            [/./, "text"],
          ],
          math: [
            [/[\^_]/, "text.special"],
            [/\\begin(?=\s*\{)/, "command", "@begin"],
            [/\\[\\]/, "command"],
            [/\{/, "delimiter.curly", "math.group"],
            { include: "@commands.math" },
            { include: "@common" },
            [/./, "text.math"],
          ],
          common: [
            [/[\{\}]/, "delimiter.curly"],
            [/[\(\)\[\]]/, "delimiter"],
            [/[&~]/, "text.special"],
            [/#+[+-]?([a-zA-Z]+|.?)/, "argument"],
            [/%/, "@rematch", "@comment"],
          ],
          comment: [[/.*/, "comment", "@pop"]],
          begin: [
            [
              /(\{)([^\{\}\\]*)(\})/,
              {
                cases: {
                  "@mathEnvironments": [
                    "delimiter.curly",
                    "string.env",
                    { token: "delimiter.curly", next: "@math.env" },
                  ],
                  "@default": [
                    "delimiter.curly",
                    "string.env",
                    { token: "delimiter.curly", next: "@pop" },
                  ],
                },
              },
            ],
            [/\s/, ""],
            [/./, "@rematch", "@pop"],
          ],
          end: [
            [
              /(\{)([^\{\}\\]*)(\})/,
              {
                cases: {
                  "@mathEnvironments": [
                    "delimiter.curly",
                    "string.env",
                    { token: "delimiter.curly", next: "@popall" },
                  ],
                  "@default": [
                    "delimiter.curly",
                    "string.env",
                    { token: "delimiter.curly", next: "@pop" },
                  ],
                },
              },
            ],
            [/\s/, ""],
            [/./, "@rematch", "@pop"],
          ],
          env: [
            [
              /(\{)([^\{\}\\]*)(\})/,
              [
                "delimiter.curly",
                "string.env",
                { token: "delimiter.curly", next: "@pop" },
              ],
            ],
            [/\s/, ""],
            [/./, "@rematch", "@pop"],
          ],
          "math.env": [
            [/\\end(?=\s*\{)/, "delimiter.command", "@end"],
            { include: "@math" },
          ],
          "math.double": [
            [/\$\$/, "delimiter.command", "@popall"],
            { include: "@math" },
          ],
          "math.single": [
            [/\$/, "delimiter.command", "@pop"],
            { include: "@math" },
          ],
          "math.[": [
            [/\\\]/, "delimiter.command", "@popall"],
            { include: "@math" },
          ],
          "math.(": [
            [/\\\)/, "delimiter.command", "@pop"],
            { include: "@math" },
          ],
          "math.group": [
            [/\{/, "delimiter.curly", "@push"],
            [/\}/, "delimiter.curly", "@pop"],
            { include: "@math" },
          ],
          "def.1": [
            [/\{/, "delimiter.curly", "@def.group.1"],
            { include: "@common" },
            { include: "@commands.nomath" },
          ],
          "def.2": [
            [/\{/, "delimiter.curly", "@def.group.2"],
            { include: "@common" },
            { include: "@commands.nomath" },
          ],
          "def.3": [
            [/\{/, "delimiter.curly", "@def.group.3"],
            { include: "@common" },
            { include: "@commands.nomath" },
          ],
          "def.4": [
            [/\{/, "delimiter.curly", "@def.group.4"],
            { include: "@common" },
            { include: "@commands.nomath" },
          ],
          "def.group.1": [
            [/\{/, "delimiter.curly", "@def.group"],
            [/\}/, "delimiter.curly", "@popall"],
            { include: "@common" },
            { include: "@commands.nomath" },
          ],
          "def.group.2": [
            [/\{/, "delimiter.curly", "@def.group"],
            [
              /(\})(\s*)(\{)/,
              [
                "delimiter.curly",
                "",
                { token: "delimiter.curly", next: "@def.group.1" },
              ],
            ],
            [/\}/, "delimiter.curly", "@popall"],
            { include: "@common" },
            { include: "@commands.nomath" },
          ],
          "def.group.3": [
            [/\{/, "delimiter.curly", "@def.group"],
            [
              /(\})(\s*)(\{)/,
              [
                "delimiter.curly",
                "",
                { token: "delimiter.curly", next: "@def.group.2" },
              ],
            ],
            [/\}/, "delimiter.curly", "@popall"],
            { include: "@common" },
            { include: "@commands.nomath" },
          ],
          "def.group.4": [
            [/\{/, "delimiter.curly", "@def.group"],
            [
              /(\})(\s*)(\{)/,
              [
                "delimiter.curly",
                "",
                { token: "delimiter.curly", next: "@def.group.3" },
              ],
            ],
            [/\}/, "delimiter.curly", "@popall"],
            { include: "@common" },
            { include: "@commands.nomath" },
          ],
          "def.group": [
            [/\{/, "delimiter.curly", "@push"],
            [/\}/, "delimiter.curly", "@pop"],
            { include: "@common" },
            { include: "@commands.nomath" },
          ],
          commands: [
            [/\$\$/, "delimiter.command", "@math.double"],
            [/\$/, "delimiter.command", "@math.single"],
            [/\\\[/, "delimiter.command", "@math.["],
            [/\\\(/, "delimiter.command", "@math.("],
            [
              /(\\[a-zA-Z]+)(\*)/,
              {
                cases: {
                  "@envStarCommands": [
                    "command",
                    { token: "text", next: "@env" },
                  ],
                  "@default": ["command", "text"],
                },
              },
            ],
            [
              /\\(@*[a-zA-Z]+|@+|.?)/,
              {
                cases: {
                  "@envCommands": { token: "command", next: "@env" },
                  "@default": "command",
                },
              },
            ],
          ],
          "commands.math": [
            [/\$\$/, "delimiter.command", "@math.double"],
            [/\$/, "delimiter.command", "@math.single"],
            [/\\\[/, "delimiter.command", "@math.["],
            [/\\\(/, "delimiter.command", "@math.("],
            [
              /(\\[a-zA-Z]+)(\*)/,
              {
                cases: {
                  "@envStarCommands": [
                    "command",
                    { token: "text", next: "@env" },
                  ],
                  "@default": ["command.math", "text"],
                },
              },
            ],
            [
              /\\(@*[a-zA-Z]+|@+|.?)/,
              {
                cases: {
                  "@envCommands": { token: "command", next: "@env" },
                  "@default": "command.math",
                },
              },
            ],
          ],
          "commands.nomath": [
            [/\$/, "delimiter.command"],
            [/\\\[/, "delimiter.command"],
            [/\\\(/, "delimiter.command"],
            [
              /(\\[a-zA-Z]+)(\*)/,
              {
                cases: {
                  "@envStarCommands": [
                    "command",
                    { token: "text", next: "@env" },
                  ],
                  "@default": ["command", "text"],
                },
              },
            ],
            [
              /\\(@*[a-zA-Z]+|@+|.?)/,
              {
                cases: {
                  "@envCommands": { token: "command", next: "@env" },
                  "@default": "command",
                },
              },
            ],
          ],
        },
        brackets: [{ open: "{", close: "}", token: "delimiter.curly" }],
      });
  }),
  define("lib/themes", ["require", "exports"], function (e, o) {
    "use strict";
    Object.defineProperty(o, "__esModule", { value: !0 }),
      (o.btexLightTheme = void 0),
      (o.btexLightTheme = {
        base: "vs",
        inherit: !1,
        rules: [
          { token: "keyword", foreground: "f87000" },
          { token: "command", foreground: "f87000" },
          { token: "attribute.value", foreground: "f87000" },
          { token: "tag", foreground: "f8a000" },
          { token: "command.math", foreground: "f8a000" },
          { token: "delimiter", foreground: "40484c" },
          { token: "delimiter.command", foreground: "f87000" },
          { token: "delimiter.css", foreground: "687074" },
          { token: "delimiter.html", foreground: "a0a8b0" },
          { token: "attribute.name", foreground: "30a0e0" },
          { token: "argument", foreground: "30a0e0" },
          { token: "string", foreground: "70a000" },
          { token: "identifier", foreground: "40484c" },
          { token: "text", foreground: "40484c" },
          { token: "text.math", foreground: "687074" },
          { token: "text.special", foreground: "f87000" },
          { token: "comment", foreground: "a0a0a0" },
        ],
        colors: {
          "editorLineNumber.foreground": "#c4d0d4",
          "editorLineNumber.activeForeground": "#78848c",
          "editor.lineHighlightBackground": "#8098a018",
          "editor.lineHighlightBorder": "transparent",
          "editor.selectionBackground": "#0090d028",
          "minimap.selectionHighlight": "#0090d050",
          "menu.selectionBackground": "#0090d028",
          "menu.selectionForeground": "#404040",
        },
      });
  }),
  define("lib/DefinitionProvider", [
    "require",
    "exports",
    "monaco-editor",
    "lib/common",
    "lib/data",
  ], function (e, o, t, n, r) {
    "use strict";
    function i(e, o) {
      o.startsWith("\\") && (o = o.substring(1));
      let t = new RegExp(
          "(\\\\@?([aegpt@]?def|[apt@]?let|(re)?newcommand\\s*\\*?\\s*\\{?)\\s*)\\\\" +
            (/^@?@?[a-zA-Z]+/.test(o) ? `${o}(?![a-zA-Z])` : `\\${o}`)
        ),
        r = e.getLinesContent(),
        i = [];
      for (let o = 0; o < r.length; o++) {
        let d = r[o];
        if (d.length > n.options.maxParsedLineLength) continue;
        let m = (d = d
          .replace(/\\\\/g, "  ")
          .replace(/(^|[^\\])%.*/, "$1")).match(t);
        m &&
          i.push({
            range: {
              startLineNumber: o + 1,
              endLineNumber: o + 1,
              startColumn: 1 + m.index + m[1].length,
              endColumn: 1 + m.index + m[0].length,
            },
            uri: e.uri,
          });
      }
      return i;
    }
    Object.defineProperty(o, "__esModule", { value: !0 }),
      (o.overrideGoToDefinition = o.btexDefinitionProvider = void 0),
      (o.btexDefinitionProvider = {
        provideDefinition: function (e, o) {
          let n = e
              .getValueInRange({
                startLineNumber: o.lineNumber,
                endLineNumber: o.lineNumber,
                startColumn: 1,
                endColumn: o.column,
              })
              .replace(/\\\\/g, "  ")
              .replace(/(^|[^\\])%.*/, "$1"),
            d = e.getLineContent(o.lineNumber),
            m = n.match(/\\(@?@?[a-zA-Z]*|[^@]?)$/);
          if (m) {
            let o = d.substring(m.index).match(/^\\(@?@?[a-zA-Z]+|[^@]?)/)[0];
            if (/^\\(@@.*|)$/.test(o)) return [];
            let n = i(e, o);
            for (let e of r.imports) {
              let r = t.editor.getModel(e.uri);
              r && n.push(...i(r, o));
            }
            return 0 === n.length ? null : n;
          }
        },
      }),
      (o.overrideGoToDefinition = function (e) {
        const o = e._codeEditorService,
          t = o.openCodeEditor.bind(o);
        o.openCodeEditor = (e, o) =>
          __awaiter(this, void 0, void 0, function* () {
            const n = yield t(e, o);
            return (
              null === n &&
                o.trigger(null, "editor.action.peekDefinition", void 0),
              n
            );
          });
      });
  }),
  define("btex-monaco", [
    "require",
    "exports",
    "monaco-editor",
    "lib/common",
    "lib/CompletionItemProvider",
    "lib/handlers",
    "lib/LanguageConfiguration",
    "lib/TokensProvider",
    "lib/themes",
    "lib/DefinitionProvider",
    "lib/data",
  ], function (e, o, t, n, r, i, d, m, a, l, s) {
    "use strict";
    Object.defineProperty(o, "__esModule", { value: !0 }),
      (o.addImport = o.createEditor = o.setLocale = void 0),
      navigator.clipboard || (navigator.clipboard = {}),
      navigator.clipboard.readText ||
        (navigator.clipboard.readText = function () {
          return new Promise((e) => e(""));
        }),
      t.languages.register({ id: "btex" }),
      t.languages.setMonarchTokensProvider("btex", m.btexTokensProvider),
      t.languages.setLanguageConfiguration("btex", d.btexLanguageConfiguration),
      t.languages.registerCompletionItemProvider(
        "btex",
        r.btexCompletionItemProvider
      ),
      t.languages.registerDefinitionProvider("btex", l.btexDefinitionProvider),
      t.editor.defineTheme("btex-light", a.btexLightTheme),
      (o.setLocale = function (e) {
        n.options.locale = e;
      }),
      (o.createEditor = function (e, o, n, r = "btex", d) {
        let m = t.editor.create(e, {
          language: r,
          theme: "btex-light",
          fontFamily:
            '"Cascadia Code", "Microsoft YaHei UI", "Microsoft YaHei", sans-serif',
          fontSize: 16,
          readOnly: d,
        });
        return (
          "btex" === r &&
            (function (e) {
              e.updateOptions({
                detectIndentation: !1,
                wordBasedSuggestions: !1,
                wordSeparators: "`~!#$%^&*()-_=+[{]}\\|;:'\",.<>/?",
              }),
                e.onDidChangeModelContent((o) =>
                  i.onDidChangeModelContent(e, o)
                ),
                e.onDidChangeCursorPosition((o) =>
                  i.onDidChangeCursorPosition(e, o)
                ),
                l.overrideGoToDefinition(e);
            })(m),
          m.setValue(null != o ? o : ""),
          d || (m._diffSource = null != n ? n : ""),
          m
        );
      }),
      (o.addImport = function (e, o) {
        let n = t.Uri.file(e);
        s.imports.push({ uri: n, content: o }),
          t.editor.createModel(o, "btex", n);
      });
  }),
  define("lib/StorageService", ["require", "exports"], function (e, o) {
    "use strict";
    function t(e) {
      return null == e;
    }
    Object.defineProperty(o, "__esModule", { value: !0 }),
      (o.StorageService = void 0);
    o.StorageService = class {
      constructor() {
        (this.globalCache = new Map()), (this.workspaceCache = new Map());
      }
      getCache(e) {
        return 0 === e ? this.globalCache : this.workspaceCache;
      }
      get(e, o, n) {
        const r = this.getCache(o).get(e);
        return t(r) ? n : r;
      }
      getBoolean(e, o, n) {
        const r = this.getCache(o).get(e);
        return t(r) ? n : "true" === r;
      }
      getNumber(e, o, n) {
        const r = this.getCache(o).get(e);
        return t(r) ? n : parseInt(r, 10);
      }
      store(e, o, n) {
        if (t(o)) return this.remove(e, n);
        const r = String(o);
        this.getCache(n).set(e, r);
      }
      remove(e, o) {
        this.getCache(o).delete(e);
      }
      onWillSaveState() {}
      onDidChangeStorage() {}
    };
  }),
  require(["btex-monaco"], function (e) {
    /mobi/i.test(window.navigator.userAgent)
      ? $("textarea#wpTextbox1").addClass("b-unhide")
      : (e.setLocale("zh"),
        docReady(function () {
          if (window.monacoEditorData) {
            let o = $("textarea#wpTextbox1");
            o.css("display", "none"),
              ($div = $(
                '<div id="btex-monaco-container" class="btex-monaco-container">'
              )),
              $div.insertBefore(o);
            let t = window.monacoEditorData,
              n = e.createEditor(
                document.getElementById("btex-monaco-container"),
                o.val(),
                t.oldText,
                t.lang,
                t.readOnly
              );
            t.preamble && e.addImport("/preamble", t.preamble),
              n.onDidChangeModelContent(function () {
                o.val(n.getValue());
              }),
              (window.monacoEditor = n);
          }
        }));
  });
