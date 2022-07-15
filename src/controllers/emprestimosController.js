import Emprestimo from "../models/Emprestimo";
import EmprestimoLivro from "../models/EmprestimoLivro";
import Livro from "../models/Livro";
import { Op } from "sequelize";

const getAll = async (req, res) => {
  try {
    const emprestimos = await Emprestimo.findAll();
    let response = [];
    for (let emprestimo of emprestimos) {
      let livros = await emprestimo.getLivros(); //pegamos os livros do MODEL Emprestimo
      emprestimo = emprestimo.toJSON(); //converter o emprestimo para JSON
      emprestimo.livros = livros; //setar no JSON do emprestimo um novo atributo livros
      response.push(emprestimo);
    }
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({
      message: error.message
    })
  }
}

const getById = async (req, res) => {
  try {
    let { id } = req.params;

    //garante que o id só vai ter NUMEROS;
    id = id ? id.toString().replace(/\D/g, '') : null;
    if (!id) {
      return res.status(400).send({
        message: 'Informe um id válido para consulta'
      });
    }

    let emprestimo = await Emprestimo.findOne({
      where: {
        id
      }
    });

    if (!emprestimo) {
      return res.status(400).send({
        message: `Não foi encontrado emprestimo com o id ${id}`
      });
    }

    let response = emprestimo.toJSON();
    response.livros = await emprestimo.getLivros({
      attributes: ['id', 'titulo'],
    });

    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({
      message: error.message
    })
  }
}

const persistir = async (req, res) => {
  try {
    let { id } = req.params;
    //caso nao tenha id, cria um novo registro
    if (!id) {
      return await create(req.body, res)
    }

    return await update(id, req.body, res)
  } catch (error) {
    return res.status(500).send({
      message: error.message
    })
  }
}

const create = async (dados, res) => {
  let { prazo, devolucao, idUsuario, livros } = dados;

  let emprestimo = await Emprestimo.create({
    prazo, devolucao, idUsuario
  });

  for (let livro of livros) {

    let livroExistente = await Livro.findOne({
      where: {
        id: livro
      }
    })

    //livro não existente não pode ser emprestado
    //com isso o emprestimo é cancelado/excluido
    if (!livroExistente) {
      await emprestimo.destroy();
      return res.status(400).send({
        message: `O livro id ${livro} não existe. O empréstimo não foi salvo!!`
      })
    }

    let emprestimosAtivos = await livroExistente.getEmprestimos({
      where: {
        devolucao: {
          [Op.is]: null
        }
      },
      limit: 1
    });

    if (emprestimosAtivos.length) {
      await emprestimo.destroy();
      return res.status(400).send({
        message: `O livro id ${livro} já está emprestado no empréstimo ${emprestimosAtivos[0].id}. O empréstimo não foi salvo!!`
      })
    };

    await EmprestimoLivro.create({
      idEmprestimo: emprestimo.id,
      idLivro: livro
    });
  }

  return res.status(201).send(emprestimo)
}

const update = async (id, dados, res) => {
  let emprestimo = await Emprestimo.findOne({
    where: {
      id
    }
  });

  if (!emprestimo) {
    return res.status(400).send({ type: 'error', message: `Não foi encontrada emprestimo com o id ${id}` })
  }

  //update dos campos
  Object.keys(dados).forEach(field => emprestimo[field] = dados[field]);

  await emprestimo.save();
  return res.status(200).send({
    message: `Emprestimo ${id} atualizada com sucesso`,
    data: emprestimo
  });
}

const deletar = async (req, res) => {
  try {
    let { id } = req.body;
    //garante que o id só vai ter NUMEROS;
    id = id ? id.replace(/\D/g, '') : null;
    if (!id) {
      return res.status(400).send({
        message: 'Informe um id válido para deletar o emprestimo'
      });
    }

    let emprestimo = await Emprestimo.findOne({
      where: {
        id
      }
    });

    if (!emprestimo) {
      return res.status(400).send({ message: `Não foi encontrada emprestimo com o id ${id}` })
    }

    await emprestimo.destroy();
    return res.status(200).send({
      message: `Emprestimo id ${id} deletada com sucesso`
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
}

const verificarLivro = async (req, res) => {
  try {
    let { idLivro } = req.body;

    //garante que o id só vai ter NUMEROS;
    idLivro = idLivro ? idLivro.toString().replace(/\D/g, '') : null;
    if (!idLivro) {
      return res.status(400).send({
        message: 'Informe um id válido para consultar o livro'
      });
    }

    let livro = await Livro.findOne({
      where: {
        id: idLivro
      }
    });

    if (!livro) {
      return res.status(400).send({ message: `Não foi encontrado livro com o id ${id}` })
    }

    let emprestimos = await livro.getEmprestimos({
      where: {
        devolucao: {
          [Op.is]: null
        }
      }
    });
    
    if (!emprestimos.length) {
      return res.status(200).send({ message: 'Esse livro está disponível para emprestimo' })
    }

    return res.status(200).send({
      message: 'Esse livro não está disponível para emprestimo',
      emprestimos
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
}

export default {
  getAll,
  getById,
  persistir,
  deletar,
  verificarLivro
};