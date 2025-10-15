'use client';

import { useState } from 'react';
import DemoContainer from '@/components/DemoContainer';

export default function PrototypeDemo() {
  const [activeTab, setActiveTab] = useState('basic');

  // 示例对象
  const person = {
    name: 'Alice',
    sayHello() {
      return `Hello, I'm ${this.name}`;
    }
  };

  const student = Object.create(person);
  student.grade = 'A';
  student.study = function() {
    return `${this.name} is studying`;
  };

  return (
    <DemoContainer
      title="原型链"
      description="可视化原型链关系 - 理解 JavaScript 继承机制"
    >
      <div className="space-y-6">
        {/* 核心概念 */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-cyan-900 mb-4">🔗 原型链核心概念</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-cyan-900 mb-2">prototype</h4>
              <p className="text-sm text-gray-700">
                构造函数的属性，指向原型对象
              </p>
              <div className="mt-2 text-xs text-cyan-700 bg-cyan-50 p-2 rounded">
                Function.prototype
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-blue-900 mb-2">__proto__</h4>
              <p className="text-sm text-gray-700">
                实例对象的属性，指向构造函数的原型
              </p>
              <div className="mt-2 text-xs text-blue-700 bg-blue-50 p-2 rounded">
                obj.__proto__
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-indigo-900 mb-2">constructor</h4>
              <p className="text-sm text-gray-700">
                原型对象的属性，指向构造函数
              </p>
              <div className="mt-2 text-xs text-indigo-700 bg-indigo-50 p-2 rounded">
                prototype.constructor
              </div>
            </div>
          </div>
        </div>

        {/* Tab 切换 */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex gap-2 mb-4">
            {[
              { id: 'basic', name: '基础示例' },
              { id: 'chain', name: '原型链查找' },
              { id: 'inheritance', name: '继承实现' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-cyan-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* 基础示例 */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border-2 border-cyan-200">
                <h4 className="font-semibold text-cyan-900 mb-3">1️⃣ 构造函数和原型</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  <pre>{`function Person(name) {
  this.name = name;
}

// 在原型上添加方法
Person.prototype.sayHello = function() {
  return 'Hello, I\\'m ' + this.name;
};

const alice = new Person('Alice');

console.log(alice.name);        // 'Alice' (自身属性)
console.log(alice.sayHello());  // 'Hello, I\\'m Alice' (原型方法)
console.log(alice.__proto__ === Person.prototype); // true
console.log(Person.prototype.constructor === Person); // true`}</pre>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-sm text-yellow-800">
                  💡 <strong>关键：</strong>实例对象通过 __proto__ 访问构造函数的 prototype
                </p>
              </div>
            </div>
          )}

          {/* 原型链查找 */}
          {activeTab === 'chain' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3">2️⃣ 属性查找机制</h4>
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-sm font-semibold text-blue-900 mb-2">查找顺序：</p>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal ml-5">
                      <li>在对象自身查找</li>
                      <li>在对象的 __proto__ (即构造函数的 prototype) 查找</li>
                      <li>在 __proto__ 的 __proto__ 查找</li>
                      <li>一直找到 Object.prototype</li>
                      <li>Object.prototype.__proto__ 是 null，查找结束</li>
                    </ol>
                  </div>

                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                    <pre>{`const obj = { a: 1 };

// 原型链：obj → Object.prototype → null

console.log(obj.a);              // 1 (自身属性)
console.log(obj.toString);        // [Function] (Object.prototype)
console.log(obj.notExist);        // undefined (链上不存在)

// 验证原型链
obj.__proto__ === Object.prototype          // true
Object.prototype.__proto__ === null         // true`}</pre>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <h5 className="font-semibold text-green-900 mb-2">🎯 可视化原型链</h5>
                <div className="font-mono text-sm text-green-800 space-y-1">
                  <div>obj</div>
                  <div className="ml-4">↓ __proto__</div>
                  <div>Object.prototype (toString, hasOwnProperty...)</div>
                  <div className="ml-4">↓ __proto__</div>
                  <div>null</div>
                </div>
              </div>
            </div>
          )}

          {/* 继承实现 */}
          {activeTab === 'inheritance' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border-2 border-indigo-200">
                <h4 className="font-semibold text-indigo-900 mb-3">3️⃣ 实现继承</h4>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">方法1: 原型链继承</p>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                      <pre>{`function Animal(name) {
  this.name = name;
}
Animal.prototype.eat = function() {
  return this.name + ' is eating';
};

function Dog(name, breed) {
  Animal.call(this, name); // 继承属性
  this.breed = breed;
}

// 继承方法
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  return 'Woof!';
};

const dog = new Dog('Buddy', 'Golden');
console.log(dog.name);    // 'Buddy'
console.log(dog.eat());   // 'Buddy is eating'
console.log(dog.bark());  // 'Woof!'`}</pre>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">方法2: ES6 Class (语法糖)</p>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                      <pre>{`class Animal {
  constructor(name) {
    this.name = name;
  }
  
  eat() {
    return \`\${this.name} is eating\`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  
  bark() {
    return 'Woof!';
  }
}

const dog = new Dog('Buddy', 'Golden');
// 本质上还是原型链继承`}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 交互演示 */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-4">🎮 交互演示</h3>
          <div className="bg-white p-4 rounded-lg">
            <div className="space-y-3">
              <div className="p-3 bg-cyan-50 rounded border border-cyan-200">
                <div className="text-sm font-semibold text-cyan-900">person 对象</div>
                <div className="text-xs text-cyan-700 mt-1">
                  {`{ name: 'Alice', sayHello: ƒ }`}
                </div>
              </div>
              <div className="flex items-center justify-center text-cyan-600">
                <div className="text-sm">↓ Object.create(person)</div>
              </div>
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <div className="text-sm font-semibold text-blue-900">student 对象</div>
                <div className="text-xs text-blue-700 mt-1">
                  {`{ grade: 'A', study: ƒ }`}
                </div>
                <div className="text-xs text-blue-600 mt-2">
                  __proto__ → person (可以访问 name 和 sayHello)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 面试高频QA */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-red-900 mb-4">❓ 面试高频 QA</h3>
          <div className="space-y-3">
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q1: prototype 和 __proto__ 的区别？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <ul className="list-disc ml-5">
                  <li><strong>prototype:</strong> 函数才有，指向原型对象</li>
                  <li><strong>__proto__:</strong> 所有对象都有，指向构造函数的原型</li>
                </ul>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`function Person() {}
const p = new Person();

Person.prototype        // 原型对象
p.__proto__            // 指向 Person.prototype
p.__proto__ === Person.prototype  // true`}
                </pre>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q2: 如何判断属性是自身的还是原型上的？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <p>使用 <code>hasOwnProperty</code>：</p>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`const obj = { a: 1 };

obj.hasOwnProperty('a');         // true (自身)
obj.hasOwnProperty('toString');  // false (原型)`}
                </pre>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q3: new 操作符做了什么？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <ol className="list-decimal ml-5 space-y-1">
                  <li>创建一个新对象</li>
                  <li>将新对象的 __proto__ 指向构造函数的 prototype</li>
                  <li>将构造函数的 this 绑定到新对象</li>
                  <li>执行构造函数</li>
                  <li>返回新对象（如果构造函数没有返回对象）</li>
                </ol>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`// 手写 new
function myNew(Constructor, ...args) {
  const obj = {};
  obj.__proto__ = Constructor.prototype;
  const result = Constructor.apply(obj, args);
  return typeof result === 'object' ? result : obj;
}`}
                </pre>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q4: Object.create() 的作用？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <p>创建一个新对象，使用现有对象作为新对象的 __proto__：</p>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`const parent = { x: 1 };
const child = Object.create(parent);

child.y = 2;
console.log(child.x);  // 1 (从原型继承)
console.log(child.y);  // 2 (自身属性)

// 手写实现
function create(proto) {
  function F() {}
  F.prototype = proto;
  return new F();
}`}
                </pre>
              </div>
            </details>
          </div>
        </div>

        {/* 常见陷阱 */}
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
          <h4 className="font-semibold text-orange-900 mb-3">⚠️ 常见陷阱</h4>
          <div className="space-y-2 text-sm text-orange-800">
            <div>
              <strong>陷阱1:</strong> 直接赋值 prototype 会丢失 constructor
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`Dog.prototype = Animal.prototype;  // ❌ 错误
Dog.prototype = Object.create(Animal.prototype);  // ✅ 正确
Dog.prototype.constructor = Dog;  // 记得修正 constructor`}
              </pre>
            </div>
            <div>
              <strong>陷阱2:</strong> 修改原型会影响所有实例
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`Person.prototype.age = 18;
const p1 = new Person();
const p2 = new Person();
console.log(p1.age, p2.age); // 18, 18 (共享)`}
              </pre>
            </div>
          </div>
        </div>

        {/* 实际应用 */}
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
          <h4 className="font-semibold text-indigo-900 mb-2">🚀 实际应用场景</h4>
          <ul className="text-sm text-indigo-800 space-y-1">
            <li>• 实现继承和代码复用</li>
            <li>• 扩展内置对象（如 Array.prototype.myMethod）</li>
            <li>• 实现插件系统</li>
            <li>• Polyfill 和 Shim</li>
          </ul>
        </div>
      </div>
    </DemoContainer>
  );
}
