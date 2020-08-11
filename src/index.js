import Matter from 'matter-js'
import { degrees, radians } from 'radians'
import './style.scss'


window.start = () => {

  let Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  World = Matter.World,
  Bodies = Matter.Bodies;
  // create engine
  let engine = Engine.create(),
  world = engine.world;
  // create renderer
  let renderer = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: 700,
      height: 500,
      showVelocity: true
    }
  })

  // add dummy divs that will attach to MatterJS physics
  let div1 = document.createElement('div');
  let div2 = document.createElement('div');
  let div3 = document.createElement('div');
  div1.id = 'div1';
  div2.id = 'div2';
  div3.id = 'div3';
  document.body.appendChild(div1)
  document.body.appendChild(div2)
  document.body.appendChild(div3)
  // add css walls and floors
  let floor = document.createElement('div')
  floor.id = 'floor'
  document.body.appendChild(floor)

  function render() {

    let bodies = Matter.Composite.allBodies(engine.world);
    requestAnimationFrame(render)

    bodies.forEach((body, i) => {
      if (body.label != 'Rectangle Body') {
        // let rotation = 0
        let div = document.getElementById(`div${i+1}`)
        div.style.left = body.position['x'] + 'px'
        div.style.top = body.position['y'] + 'px'
        div.style.transform = `rotate(${radians(body.angle)}deg)`
      }

    })

  }
  render()

  Render.run(renderer)

  // create runner
  let runner = Runner.create()
  Runner.run(runner, engine)

  // create bodies
  let rectWidth = 60, rectHeight = 60
  let b1 = Bodies.rectangle(200, 100, rectWidth, rectHeight, { frictionAir: 0 })
  b1.label = 'b1'
  let b2 = Bodies.rectangle(300, 100, rectWidth, rectHeight, { frictionAir: 0 })
  b2.label = 'b2'
  let b3 = Bodies.rectangle(600, 100, rectWidth, rectHeight, { frictionAir: 0 })
  b3.label = 'b3'
  // create a constraint
  let boxConstraint = Matter.Constraint.create({
    label: 'b1_b2_constraint',
    bodyA: b1,
    bodyB: b2,
    pointA: { x: rectWidth/2, y: rectHeight/2 },
    render: {
      anchors: false,
      lineWidth: 1,
      type: 'spring'
    },
    stiffness: 0.2
  })
  // console.log(b1)
  // add bodies
  World.add(world, [
    b1, b2, boxConstraint, b3,
    // walls/floors
    Bodies.rectangle(-50, 250, 200, 400, { isStatic: true }),
    Bodies.rectangle(750, 250, 200, 400, { isStatic: true }),
    Bodies.rectangle(350, 450, 700, 100, { isStatic: true }),
    Bodies.rectangle(350, 0, 700, 100, { isStatic: true }),
  ])

  // add mouse control
  // mouse constraint must be attached to render instance,
  // in this case, we use a custom render() function to move our divs
  // but need the Matter.Render instance to keep the mouse interactions correct
  let mouse = Mouse.create(renderer.canvas)
  let mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.5,
      render: { visible: false }
    }
  })

  World.add(world, mouseConstraint)

  // keep mouse in sync with rendering
  render.mouse = mouse

  // fit the render viewport to the scene
  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 700, y: 500 }
  })

  // context for MatterTools.Demo
  return {
    engine: engine,
    runner: runner,
    render: renderer,
    canvas: renderer.canvas,
    stop: () => {
      Matter.Render.stop(renderer)
      Matter.Runner.stop(runner)
    }
  }

}
