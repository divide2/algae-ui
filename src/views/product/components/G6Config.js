import G6 from '@antv/g6'

G6.registerNode('tree-node',
  {
    draw(cfg, group) {
      const rect = group.addShape('rect', {
        attrs: {
          fill: cfg.fill || '#fff',
          stroke: '#666'
        },
        name: 'rect-shape'
      })
      const hasChildren = cfg.children && cfg.children.length > 0
      const hasCheckedProperty = cfg.hasOwnProperty('checked')
      const checked = cfg.checked
      let content = cfg.label
      if (cfg.payload && cfg.payload.type === 'formula') {
        content += '-' + cfg.payload.formulaVersion
      }
      const text = group.addShape('text', {
        attrs: {
          text: content,
          x: 0,
          y: 0,
          textAlign: 'left',
          textBaseline: 'middle',
          fill: '#666'
        },
        name: 'tree_label'
      })
      const labelBox = text.getBBox()
      rect.attr({
        x: labelBox.minX - 4 - (hasCheckedProperty ? 20 : 0),
        y: labelBox.minY - 6,
        width: labelBox.width + (hasChildren ? 16 : 10) + (hasCheckedProperty ? 20 : 0),
        height: labelBox.height + 12
      })
      if (hasCheckedProperty) {
        group.addShape('rect', {
          attrs: {
            x: labelBox.minX - 18,
            y: -7,
            width: 12,
            height: 12,
            fill: '#fff',
            stroke: '#666',
            radius: 2,
            isCheckedShape: true
          },
          name: 'checkedRect'
        })
        group.addShape('text', {
          attrs: {
            x: labelBox.minX - 12,
            y: labelBox.minX + labelBox.height / 2 - 6,
            width: 12,
            height: 12,
            text: checked ? '✔' : '',
            fontSize: 12,
            textAlign: 'center',
            textBaseline: 'middle',
            fill: '#666',
            cursor: 'pointer',
            isCheckedShape: true
          },
          name: 'checked-flag'
        })
      }
      if (hasChildren) {
        group.addShape('circle', {
          attrs: {
            x: labelBox.width + 12,
            y: labelBox.minX + labelBox.height / 2 - 6,
            r: 6,
            stroke: '#666',
            fill: '#fff',
            isCollapseShape: true
          },
          name: 'collapse-circle'
        })
        group.addShape('text', {
          attrs: {
            x: labelBox.width + 12,
            y: labelBox.minX + labelBox.height / 2 - 6,
            width: 13,
            height: 13,
            textAlign: 'center',
            textBaseline: 'middle',
            text: cfg.collapsed ? '+' : '-',
            fontSize: 13,
            fill: '#666',
            cursor: 'pointer',
            isCollapseShape: true
          },
          name: 'collapse-flag'
        })
      }
      return rect
    }

  }, 'single-node')

export { G6 }
