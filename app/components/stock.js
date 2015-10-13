import React from 'react'

var Table = ReactBootstrap.Table;

class ProductBox extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }

    loadCommentsFromServer() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data})
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        })
    }

    componentDidMount() {
        this.loadCommentsFromServer();
    }

    render() {
        return (
                <row>
                    <div className="sidebar col-lg-2 no-float">
                        Side bar Event
                    </div>
                    <div className="app col-lg-10 no-float">
                        <div className="productsTable">
                            <ProductTable data={this.state.data}/>
                        </div>
                    </div>
                </row>
        )
    }
}

class ProductNavBar extends React.Component {

  render() {
      return (<ul className="nav nav-pills">
              <li role="presentation" className="active"><a href="#">Add item</a></li>
              <li role="presentation"><a href="#">Edit item</a></li>
              <li role="presentation"><a href="#">Delete Item</a></li>
             </ul>)
  }
}

class ProductTable extends React.Component {

    render() {
        var productsRows = this.props.data.map(function (product) {
            return (
                <ProductTableRow key={product.id} product={product}/>
            );
        });
        return (
            <Table>
                <ProductTableHeader />
                <tbody>
                    {productsRows}
                </tbody>
            </Table>
        );
    }
}

class ProductTableHeader extends React.Component {

    render() {
        return (
            <thead>
                <tr>

                    <th>Id</th>
                    <th>Nom</th>
                    <th>En stock</th>
                </tr>
            </thead>
        )
    }
}

class ProductTableRow extends React.Component {
    render() {
            return (
                <tr>
                    <td>{this.props.product.id}</td>
                    <td>{this.props.product.name}</td>
                    <td>{this.props.product.isInStock}</td>
                </tr>
        )
    }
}

export default ProductBox
